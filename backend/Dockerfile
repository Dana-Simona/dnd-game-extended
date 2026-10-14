FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .

RUN mkdir -p bin && javac -d bin $(find src -name "*.java")

CMD ["java", "-cp", "bin", "MainServer"]