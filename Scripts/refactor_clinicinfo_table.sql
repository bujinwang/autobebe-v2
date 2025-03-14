-- Drop the existing table if it exists
DROP TABLE IF EXISTS "ClinicInfo";

-- Create the ClinicInfo table with only the specified columns
CREATE TABLE "ClinicInfo" (
  "Id" VARCHAR(8) PRIMARY KEY,
  "Name" VARCHAR(100) NOT NULL,
  "Company" VARCHAR(100) NOT NULL,
  "Address" VARCHAR(200) NOT NULL,
  "Phone" VARCHAR(20) NOT NULL,
  "Hours" VARCHAR(200) NOT NULL,
  "WelcomeMessage" TEXT NOT NULL
);

-- Insert the clinic data into the refactored table
INSERT INTO "ClinicInfo" ("Id", "Name", "Company", "Address", "Phone", "Hours", "WelcomeMessage")
VALUES 
  ('31D14632', 'Downtown Medical Center', 'Sanya Health Inc.', '456 Main Street, Vancouver, BC V6C 2T1', '604-555-0456', 'Mon-Fri: 8:00 AM - 6:00 PM, Sat-Sun: 9:00 AM - 3:00 PM', 'Downtown Medical Center provides comprehensive healthcare services in the heart of Vancouver.'),
  
  ('4F420955', 'Naomi''s Clinic', 'Sanya Health Inc.', '123 Healthcare Drive, Vancouver, BC V6B 1S4', '604-555-0123', 'Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM, Sun: Closed', 'Welcome to Naomi''s Clinic. We are committed to providing exceptional healthcare services to our community.'),
  
  ('9C51BDC4', 'Westside Family Practice', 'Sanya Health Inc.', '789 West Boulevard, Vancouver, BC V6K 3E9', '604-555-0789', 'Mon-Thu: 8:30 AM - 7:00 PM, Fri: 8:30 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM, Sun: Closed', 'At Westside Family Practice, we provide personalized care for the whole family in a comfortable environment.');