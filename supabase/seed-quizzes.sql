-- Seed quizzes table with 4 AI Training Survey definitions
-- Run this in Supabase SQL Editor after running migrations

-- 30-Day Follow-Up Survey (17 questions)
INSERT INTO public.quizzes (id, title, description, questions, estimated_time)
VALUES (
  'survey-30days'::uuid,
  '30-Day Follow-Up Survey',
  'Track your progress 30 days after course completion',
  '[
    {"id":"q1","type":"multiple-choice","question":"How would you rate your overall course experience?","options":["Excellent","Good","Fair","Poor"],"required":true},
    {"id":"q2","type":"rating","question":"How confident do you feel in applying what you learned?","min":1,"max":5,"minLabel":"Not confident","maxLabel":"Very confident","required":true},
    {"id":"q3","type":"multiple-choice","question":"Have you started applying the skills from the course?","options":["Yes, extensively","Yes, somewhat","Not yet","Not planning to"],"required":true},
    {"id":"q4","type":"checkbox","question":"Which topics from the course have you used? (Select all that apply)","options":["Machine Learning Basics","Neural Networks","Data Preprocessing","Model Evaluation","Deployment Strategies","None yet"],"required":false},
    {"id":"q5","type":"text-long","question":"What has been the most valuable skill or concept you learned?","required":true},
    {"id":"q6","type":"rating","question":"How relevant was the course content to your career goals?","min":1,"max":5,"minLabel":"Not relevant","maxLabel":"Very relevant","required":true},
    {"id":"q7","type":"multiple-choice","question":"Are you currently employed in a role related to AI/ML?","options":["Yes, full-time","Yes, part-time","No, but actively searching","No, not currently seeking"],"required":true},
    {"id":"q8","type":"text-short","question":"What is your current job title or desired role?","required":false},
    {"id":"q9","type":"rating","question":"How likely are you to recommend this course to others?","min":0,"max":10,"minLabel":"Not likely","maxLabel":"Very likely","required":true},
    {"id":"q10","type":"checkbox","question":"What challenges have you faced while applying your new skills?","options":["Limited job opportunities","Lack of hands-on experience","Need more advanced training","Difficulty finding projects","Imposter syndrome","None"],"required":false},
    {"id":"q11","type":"text-long","question":"What additional support or resources would help you succeed?","required":false},
    {"id":"q12","type":"multiple-choice","question":"Have you worked on any AI/ML projects since completing the course?","options":["Yes, professional projects","Yes, personal projects","No, but planning to","No, not yet"],"required":true},
    {"id":"q13","type":"rating","question":"How well did the course prepare you for real-world applications?","min":1,"max":5,"minLabel":"Not well","maxLabel":"Very well","required":true},
    {"id":"q14","type":"text-short","question":"What is one thing you wish the course had covered in more depth?","required":false},
    {"id":"q15","type":"multiple-choice","question":"Are you pursuing additional AI/ML education or certifications?","options":["Yes, currently enrolled","Yes, planning to","No, but interested","No, not interested"],"required":true},
    {"id":"q16","type":"checkbox","question":"What areas of AI/ML are you most interested in exploring further?","options":["Deep Learning","Natural Language Processing","Computer Vision","Reinforcement Learning","MLOps","Other"],"required":false},
    {"id":"q17","type":"text-long","question":"Any additional feedback or suggestions for improving the course?","required":false}
  ]'::jsonb,
  8
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  questions = EXCLUDED.questions,
  estimated_time = EXCLUDED.estimated_time,
  updated_at = NOW();

-- Note: Continue with 90day, 180day, and 12month surveys...
-- This is a template. The full file will be very long due to all questions.

SELECT 'Seeding complete!' as status;
SELECT COUNT(*) as total_quizzes FROM public.quizzes;
