import React from 'react';
import { type Variants } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';
import useSound from '../../../../../../../utils/useSound/useSound';
import useSoundSequence from '../../../../../../../utils/useSound/useSoundSequence';
import {
	bgVariants,
	ringVariants,
	vHolderVariants,
	rightWingVariants,
	leftWingVariants,
	rightArmorVariants,
	leftArmorVariants,
	gemVariants,
	textVariants,
	levelNumVariants,
} from './LevelUpVariants';
import {
	GrowingContainer,
	LayerImg,
	LayerWrapper,
	LevelNumber,
	StaggeredLogo,
	Wrapper,
	BgFrameImg,
	VHolderImg,
	WingImg,
	MirroredWrapper,
	ArmorRightImg,
	ArmorLeftImg,
	LevelTextImg,
} from './LevelUpStyles';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const ASSET_PATH = assetUrl('/vfx/portalVfxs/levelUp/');
const SOUND_PATH = assetUrl('/sfx/levelUp');

const LevelUp: React.FC<Props> = ({ item }) => {
	const playLevelUp = useSound(`${SOUND_PATH}.mp3`);
	const playBuildup = useSound(`${SOUND_PATH}Buildup.mp3`);

	useSoundSequence([
		{ play: playLevelUp, delay: 0 },
		{ play: playBuildup, delay: 1300 },
	]);

	return (
		<Wrapper>
			<GrowingContainer
				initial={{ scale: 1 }}
				animate={{ scale: 1.08 }}
				transition={{
					duration: 3,
					ease: 'easeInOut',
					repeat: Infinity,
					repeatType: 'mirror',
				}}
			>
				<StaggeredLogo>
					<LayerWrapper
						variants={bgVariants}
						initial='hidden'
						animate='visible'
					>
						<BgFrameImg
							src={`${ASSET_PATH}bgFrame.png`}
							alt='Background Frame'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={ringVariants}
						initial='hidden'
						animate='visible'
					>
						<LayerImg
							src={`${ASSET_PATH}ring.png`}
							alt='Ring'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={vHolderVariants}
						initial='hidden'
						animate='visible'
					>
						<VHolderImg
							src={`${ASSET_PATH}vHolder.png`}
							alt='V-Holder'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={rightWingVariants}
						initial='hidden'
						animate='visible'
					>
						<WingImg
							src={`${ASSET_PATH}wing.png`}
							alt='Wing'
							animate={{ rotate: [0, 8, 0] }}
							transition={{
								duration: 3,
								ease: 'easeInOut',
								repeat: Infinity,
								delay: 1.55,
							}}
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={leftWingVariants}
						initial='hidden'
						animate='visible'
					>
						<MirroredWrapper>
							<WingImg
								src={`${ASSET_PATH}wing.png`}
								alt='Wing Mirrored'
								animate={{ rotate: [0, 8, 0] }}
								transition={{
									duration: 3,
									ease: 'easeInOut',
									repeat: Infinity,
									delay: 1.55,
								}}
							/>
						</MirroredWrapper>
					</LayerWrapper>

					<LayerWrapper
						variants={rightArmorVariants}
						initial='hidden'
						animate='visible'
					>
						<ArmorRightImg
							src={`${ASSET_PATH}armor.png`}
							alt='Armor Right'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={leftArmorVariants}
						initial='hidden'
						animate='visible'
					>
						<ArmorLeftImg
							src={`${ASSET_PATH}armor.png`}
							alt='Armor Left'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={gemVariants}
						initial='hidden'
						animate='visible'
					>
						<LayerImg
							src={`${ASSET_PATH}gem.png`}
							alt='Gem'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={textVariants}
						initial='hidden'
						animate='visible'
					>
						<LevelTextImg
							src={`${ASSET_PATH}levelupText.png`}
							alt='Level Up Text'
						/>
					</LayerWrapper>

					<LayerWrapper
						variants={levelNumVariants}
						initial='hidden'
						animate='visible'
					>
						<LevelNumber>{item.amount || 1}</LevelNumber>
					</LayerWrapper>
				</StaggeredLogo>
			</GrowingContainer>
		</Wrapper>
	);
};

export default LevelUp;
