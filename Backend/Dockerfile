# Stage 1: Build the app (Assuming you use Maven. If Gradle, let me know!)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Copy your pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the JAR file
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar
# Expose the port Javalin uses (usually 7070 or 8080)
EXPOSE 8080
# Run the application
CMD ["java", "-jar", "app.jar"]