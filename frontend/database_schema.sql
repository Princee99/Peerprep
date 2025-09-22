-- Create the questions table for the Q&A system
CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    company_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the answers table for the Q&A system
CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    alumni_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Create an index on company_id for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_company_id ON questions(company_id);

-- Create an index on question_id in answers for faster joins
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Add answer_count as a computed field or you can create a view
-- This assumes you want to show answer count in your frontend
CREATE OR REPLACE VIEW questions_with_answer_count AS
SELECT 
    q.*,
    COALESCE(a.answer_count, 0) as answer_count
FROM questions q
LEFT JOIN (
    SELECT 
        question_id, 
        COUNT(*) as answer_count
    FROM answers 
    GROUP BY question_id
) a ON q.question_id = a.question_id;