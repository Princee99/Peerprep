CREATE TABLE  IF NOT EXISTS users (
    user_id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student', 'alumni')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    -- description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  user_id VARCHAR(20) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  role VARCHAR(50),
  placement_type VARCHAR(20) CHECK (placement_type IN ('On-campus', 'Off-campus')),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  aptitude TEXT,
  technical TEXT,
  hr TEXT,
  tips TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);