FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . .

RUN mkdir -p bin && javac --enable-preview --release 21 -d bin $(find src -name "*.java")

CMD ["java", "--enable-preview", "-cp", "bin", "MainServer"]