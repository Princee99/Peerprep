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
    review_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    alumni_id VARCHAR(20) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_role VARCHAR(100) NOT NULL,
    placement_type VARCHAR(20) NOT NULL CHECK (placement_type IN ('on-campus', 'off-campus')),
    offer_status VARCHAR(20) NOT NULL CHECK (offer_status IN ('offer', 'no-offer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_rounds (
    round_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    round_type VARCHAR(50) NOT NULL CHECK (round_type IN ('aptitude', 'technical', 'hr', 'other')),
    description TEXT NOT NULL,
    tips TEXT
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    student_id VARCHAR(20) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(question_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    alumni_id VARCHAR(20) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_student_id ON questions(student_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_alumni_id ON answers(alumni_id);

-- Add company_id column to questions table (CORRECTED)
ALTER TABLE questions ADD COLUMN company_id INTEGER REFERENCES companies(company_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_questions_company_id ON questions(company_id);

--modify user table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS college_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_company VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
