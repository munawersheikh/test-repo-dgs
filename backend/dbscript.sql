-- Create the DGS database
CREATE DATABASE DGS;
USE DGS;

-- Create the Organization table
CREATE TABLE Organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    customerFlag BIT NULL,
    primaryPOCName VARCHAR(255) NULL UNIQUE,
    primaryPOCEmail VARCHAR(255) NULL UNIQUE,
    primaryPOCPhoneNumber VARCHAR(255) NULL UNIQUE,
    isActive BIT DEFAULT 1,
    createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NULL,
    modifiedOn DATETIME DEFAULT NULL,
    modifiedBy INT NULL
);

-- Create the Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    organizationId INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    systemID VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isActive BIT DEFAULT 1,
    createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NULL,
    modifiedOn DATETIME DEFAULT NULL,
    modifiedBy INT NULL,
    FOREIGN KEY (organizationId) REFERENCES Organizations(id)
);

-- Create the Sites table
CREATE TABLE Sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) DEFAULT NULL,
    organizationId INT NOT NULL,
    isActive BIT DEFAULT 1,
    createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NULL,
    modifiedOn DATETIME DEFAULT NULL,
    modifiedBy INT NULL,
    FOREIGN KEY (organizationId) REFERENCES Organizations(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (modifiedBy) REFERENCES Users(id)
);

-- Create the Nodes table
CREATE TABLE Nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siteId INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    alias VARCHAR(255) DEFAULT NULL,
    isActive BIT DEFAULT 1,
    createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NULL,
    modifiedOn DATETIME DEFAULT NULL,
    modifiedBy INT NULL,
    FOREIGN KEY (siteId) REFERENCES Sites(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (modifiedBy) REFERENCES Users(id)
);

-- Create the UserSites table
CREATE TABLE UserSites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siteId INT NOT NULL,
    userId INT NOT NULL,
    UNIQUE KEY unique_user_site (siteId, userId),
    FOREIGN KEY (siteId) REFERENCES Sites(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create the UserNodes table
CREATE TABLE UserNodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nodeId INT NOT NULL,
    userId INT NOT NULL,
    UNIQUE KEY unique_user_node (nodeId, userId),
    FOREIGN KEY (nodeId) REFERENCES Nodes(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create the UserPreferences table
CREATE TABLE UserPreferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    modifiedOn DATETIME NULL,
    UNIQUE KEY unique_user_preference (userId, name),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create the Screens table
CREATE TABLE Screens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the Applications table
CREATE TABLE Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the UserScreens table
CREATE TABLE UserScreens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    screenId INT NOT NULL,
    userId INT NOT NULL,
    UNIQUE KEY unique_user_screen (screenId, userId),
    FOREIGN KEY (screenId) REFERENCES Screens(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create the UserApplications table
CREATE TABLE UserApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicationId INT NOT NULL,
    userId INT NOT NULL,
    UNIQUE KEY unique_user_application (applicationId, userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);


INSERT INTO Organizations(name,primaryPOCName,primaryPOCEmail,primaryPOCPhoneNumber) 
values('DGS','DGS','sales@digitalglobalsystems.com','000');

INSERT INTO Users(userName,organizationId,role,email,password) 
values('jeremy',1,'user','jlevin@digitalglobalsystems.com','$2b$10$gFMLWS1KHCxbgQTzTQ6wmeNxDmbxc1W6FphW8U9zUDcc..XH0dWra');






