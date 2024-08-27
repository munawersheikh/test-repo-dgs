INSERT INTO Organizations(name,primaryPOCName,primaryPOCEmail,primaryPOCPhoneNumber) values('DGS','DGS','sales@digitalglobalsystems.com','000');

INSERT INTO Users(userName,organizationId,role,email,password) values('jeremy',1,'user','dgs@live.com','$2b$10$Xx2WfIkkpIao1sADD3RqkO5sdxqf97RO4UnAjKF2P7O5tTbjM2/r.');

INSERT INTO Sites (name, organizationId) values("MEMPHIS",1);
INSERT INTO Nodes (name, siteId) values("MEMPHIS_1-dgs828p002.prod",1)