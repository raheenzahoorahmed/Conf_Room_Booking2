-- Table for conference rooms
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT
);

-- Table for bookings
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
); 

-- Insert sample data into rooms table
   INSERT INTO rooms (name, location) VALUES
     ('Room A', 'First Floor'),
     ('Room B', 'Second Floor'),
     ('Room C', 'Third Floor');
    
