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
