import { useEffect, useRef, type RefObject } from 'react';
import { useAnimationControls } from 'framer-motion';
import overlayImgPath from '../../assets/levelThumbnails/overlay1.jpg';
import bgAmbianceSound from '../../assets/audio/menu/tv_static/tv_static.mp3';

type AnimationControls = ReturnType<typeof useAnimationControls>;
type MediaElement = HTMLImageElement | HTMLVideoElement;

interface UseLevelOptionsReturn {
	baseCanvasRef: RefObject<HTMLCanvasElement | null>;
	overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
	controls: AnimationControls;
}

const getMediaDimensions = (media: MediaElement) => ({
	mediaWidth: 'videoWidth' in media ? media.videoWidth : media.width,
	mediaHeight: 'videoHeight' in media ? media.videoHeight : media.height,
});

const createOffscreenCtx = (w: number, h: number) => {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	return canvas.getContext('2d');
};

const drawScaledMedia = (
	media: MediaElement,
	w: number,
	h: number,
): ImageData | null => {
	const { mediaWidth: mw, mediaHeight: mh } = getMediaDimensions(media);
	if (!mw || !mh) return null;

	const offCtx = createOffscreenCtx(w, h);
	if (!offCtx) return null;

	const scale = Math.max(w / mw, h / mh);
	const x = (w - mw * scale) / 2;
	const y = (h - mh * scale) / 2;
	offCtx.drawImage(media, x, y, mw * scale, mh * scale);
	return offCtx.getImageData(0, 0, w, h);
};

const mapFisheyeCoords = (
	px: number,
	py: number,
	cx: number,
	cy: number,
	strength: number,
) => {
	const dx = (px - cx) / cx;
	const dy = (py - cy) / cy;
	const r = Math.sqrt(dx * dx + dy * dy);
	if (r === 0) return { srcX: px, srcY: py };

	const nr = Math.pow(r, strength);
	return {
		srcX: Math.round(cx + (dx / r) * nr * cx),
		srcY: Math.round(cy + (dy / r) * nr * cy),
	};
};

const copyPixel = (
	src: Uint8ClampedArray,
	dst: Uint8ClampedArray,
	srcIdx: number,
	dstIdx: number,
) => {
	dst[dstIdx] = src[srcIdx];
	dst[dstIdx + 1] = src[srcIdx + 1];
	dst[dstIdx + 2] = src[srcIdx + 2];
	dst[dstIdx + 3] = src[srcIdx + 3];
};

const distortPixel = (
	px: number,
	py: number,
	w: number,
	h: number,
	src: Uint8ClampedArray,
	dst: Uint8ClampedArray,
) => {
	const cx = w / 2;
	const cy = h / 2;
	const { srcX, srcY } = mapFisheyeCoords(px, py, cx, cy, 1.3);
	const dstIdx = (py * w + px) * 4;

	if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
		copyPixel(src, dst, (srcY * w + srcX) * 4, dstIdx);
	} else {
		dst[dstIdx + 3] = 0;
	}
};

const applyFisheyeDistortion = (
	srcData: ImageData,
	dstData: ImageData,
	w: number,
	h: number,
) => {
	for (let py = 0; py < h; py++) {
		for (let px = 0; px < w; px++) {
			distortPixel(px, py, w, h, srcData.data, dstData.data);
		}
	}
};

const createVignetteGradient = (
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
) => {
	const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
	grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
	grad.addColorStop(0.7, 'rgba(13, 13, 13, 0.2)');
	grad.addColorStop(1, 'rgba(13, 13, 13, 0.85)');
	return grad;
};

const drawVignette = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
	const cx = w / 2;
	const cy = h / 2;
	ctx.fillStyle = createVignetteGradient(ctx, cx, cy, Math.max(cx, cy) * 1.3);
	ctx.fillRect(0, 0, w, h);
};

const processCanvasFisheye = (
	media: MediaElement,
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
) => {
	const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
	const height = (canvas.height = 200);

	const srcData = drawScaledMedia(media, width, height);
	if (!srcData) return;

	const dstData = ctx.createImageData(width, height);
	applyFisheyeDistortion(srcData, dstData, width, height);
	ctx.putImageData(dstData, 0, 0);
	drawVignette(ctx, width, height);
};

const setupVideoOptions = (video: HTMLVideoElement) => {
	video.loop = true;
	video.muted = true;
	video.playsInline = true;
	video.play();
};

const createMediaElement = (src: string, isVideo: boolean): MediaElement => {
	const media = isVideo ? document.createElement('video') : new Image();
	media.crossOrigin = 'anonymous';
	media.src = src;
	if (isVideo) setupVideoOptions(media as HTMLVideoElement);
	return media;
};

export const useLevelOptions = (imagePath: string): UseLevelOptionsReturn => {
	const baseCanvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	const controls = useAnimationControls();

	// Ambient loop audio setup
	const bgAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (typeof Audio !== 'undefined') {
			const audio = new Audio(bgAmbianceSound);
			audio.loop = true;
			audio.volume = 0.05;
			audio.play().catch(() => {});
			bgAudioRef.current = audio;
		}

		return () => {
			if (bgAudioRef.current) {
				bgAudioRef.current.pause();
				bgAudioRef.current = null;
			}
		};
	}, []);

	// flicker animation
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		let isMounted = true;

		const triggerFlicker = async () => {
			if (!isMounted) return;
			await controls.start({
				filter: [
					'brightness(1)',
					'brightness(1.35)',
					'brightness(0.75)',
					'brightness(1.2)',
					'brightness(0.85)',
					'brightness(1)',
				],
				transition: {
					duration: 0.15 + Math.random() * 0.15,
					ease: 'linear',
				},
			});
			timeoutId = setTimeout(triggerFlicker, 2000 + Math.random() * 4000);
		};

		timeoutId = setTimeout(triggerFlicker, Math.random() * 3000);
		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [controls]);

	// dim animation
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		let isMounted = true;

		const triggerDim = async () => {
			if (!isMounted) return;
			await controls.start({
				filter: ['brightness(0.8)', 'brightness(0.8)', 'brightness(1)'],
				transition: {
					duration: 1.0,
					times: [0, 0.99, 1],
					ease: 'linear',
				},
			});
			timeoutId = setTimeout(triggerDim, 6000 + Math.random() * 10000);
		};

		timeoutId = setTimeout(triggerDim, 1000 + Math.random() * 5000);
		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [controls]);

	// fisheye distort
	useEffect(() => {
		const baseCanvas = baseCanvasRef.current;
		const overlayCanvas = overlayCanvasRef.current;
		if (!baseCanvas || !overlayCanvas) return;

		const baseCtx = baseCanvas.getContext('2d');
		const overlayCtx = overlayCanvas.getContext('2d');
		if (!baseCtx || !overlayCtx) return;

		let animFrameId: number;

		const overlayImg = createMediaElement(
			overlayImgPath,
			false,
		) as HTMLImageElement;
		overlayImg.onload = () =>
			processCanvasFisheye(overlayImg, overlayCanvas, overlayCtx);

		const isBaseVideo =
			imagePath.endsWith('.mp4') || imagePath.endsWith('.webm');
		const baseMedia = createMediaElement(imagePath, isBaseVideo);

		const render = () => {
			processCanvasFisheye(baseMedia, baseCanvas, baseCtx);
			if (isBaseVideo) animFrameId = requestAnimationFrame(render);
		};

		if (isBaseVideo) render();
		else (baseMedia as HTMLImageElement).onload = render;

		return () => {
			if (animFrameId) cancelAnimationFrame(animFrameId);
		};
	}, [imagePath]);

	return { baseCanvasRef, overlayCanvasRef, controls };
};
