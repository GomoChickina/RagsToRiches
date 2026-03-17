# Stage 1: Build the app
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render uses port 10000 by default for free services
EXPOSE 10000

# Pass the port to your Java app via an environment variable
CMD ["java", "-jar", "app.jar"]