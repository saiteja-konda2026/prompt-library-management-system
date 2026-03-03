-- =============================================
-- Seed Data for Prompt Library Management System
-- =============================================

-- 1. SQL Query Assistant (SYSTEM, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (1, 'SQL Query Assistant', 'System prompt that configures an AI agent to help users write and optimize SQL queries', 'SYSTEM',
'You are {{agent_name}}, an expert SQL assistant specializing in {{database_type}}.

Your role is to help users write, debug, and optimize SQL queries.

{{#context}}Here is the relevant schema context:
{{context}}{{/context}}

Guidelines:
- Always explain your query logic step by step
- Suggest performance optimizations when applicable
- Use {{sql_style}} naming conventions',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Data Analysis Starter (STARTER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (2, 'Data Analysis Starter', 'Conversation starter for data analysis tasks with customizable dataset context', 'STARTER',
'I''d like help analyzing {{dataset_name}}. The data contains {{data_description}}.

{{#analysis_goal}}My primary goal is: {{analysis_goal}}{{/analysis_goal}}

Please suggest the best approach to get started.',
'ACTIVE', 1, 'admin', 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Code Review Follow-up (FOLLOW_UP, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (3, 'Code Review Follow-up', 'Follow-up prompt to dive deeper into code review findings', 'FOLLOW_UP',
'Based on the previous code review of {{file_name}}, let''s dive deeper into the {{issue_category}} issues found.

Specifically, please:
1. Explain why {{specific_issue}} is problematic
2. Provide a refactored version following {{coding_standard}} best practices
3. Suggest tests to prevent regression',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Email Draft Helper (USER, DRAFT)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (4, 'Email Draft Helper', 'Helps users draft professional emails with customizable tone and context', 'USER',
'Please help me draft a {{email_type}} email to {{recipient_role}}.

Subject: {{subject}}

Key points to cover:
{{key_points}}

Tone: {{tone}}
{{#signature}}Sign off as: {{signature}}{{/signature}}',
'DRAFT', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. API Documentation Generator (SYSTEM, DRAFT)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (5, 'API Documentation Generator', 'System prompt for generating comprehensive API documentation from endpoint definitions', 'SYSTEM',
'You are a technical writer specializing in {{doc_format}} API documentation.

Generate documentation for the following API endpoint:
- Method: {{http_method}}
- Path: {{endpoint_path}}
- Description: {{endpoint_description}}

{{#request_body}}Request Body:
{{request_body}}{{/request_body}}

Include: description, parameters, request/response examples, and error codes.
Follow {{style_guide}} documentation standards.',
'DRAFT', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Customer Support Bot (STARTER, ARCHIVED)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (6, 'Customer Support Bot', 'Archived starter prompt for customer support conversations', 'STARTER',
'Hello! I''m {{bot_name}}, your {{company_name}} support assistant.

I can help you with:
- {{support_category_1}}
- {{support_category_2}}
- {{support_category_3}}

How can I assist you today?',
'ARCHIVED', 1, 'admin', 'admin', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 7. Database Schema Designer (USER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (7, 'Database Schema Designer', 'Helps design and optimize database schemas with best practices for normalization and indexing', 'USER',
'You are a database architect helping design a schema for {{project_name}}.

Requirements:
{{requirements}}

Target database: {{database_type}}

Please:
1. Propose a normalized schema with tables, columns, and relationships
2. Suggest appropriate indexes for query optimization
3. Identify potential performance bottlenecks
{{#constraints}}Additional constraints: {{constraints}}{{/constraints}}',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- Prompt Tags
-- =============================================

-- Tags for SQL Query Assistant (id=1)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (1, 'sql');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (1, 'database');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (1, 'query-optimization');

-- Tags for Data Analysis Starter (id=2)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (2, 'data-analysis');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (2, 'data-engineering');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (2, 'starter');

-- Tags for Code Review Follow-up (id=3)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (3, 'code-review');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (3, 'best-practices');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (3, 'refactoring');

-- Tags for Email Draft Helper (id=4)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (4, 'email');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (4, 'communication');

-- Tags for API Documentation Generator (id=5)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (5, 'api');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (5, 'documentation');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (5, 'openapi');

-- Tags for Customer Support Bot (id=6)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (6, 'customer-support');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (6, 'chatbot');

-- Tags for Database Schema Designer (id=7)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (7, 'database-design');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (7, 'query-optimization');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (7, 'schema-design');

-- =============================================
-- Prompt Variables
-- =============================================

-- Variables for SQL Query Assistant (id=1)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (1, 'agent_name', 'Name of the SQL assistant agent', 'SQLBot', TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (1, 'database_type', 'Target database system', 'PostgreSQL', TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (1, 'context', 'Schema or table context for the query', NULL, FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (1, 'sql_style', 'SQL naming convention style', 'snake_case', FALSE);

-- Variables for Data Analysis Starter (id=2)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (2, 'dataset_name', 'Name of the dataset to analyze', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (2, 'data_description', 'Brief description of the data contents', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (2, 'analysis_goal', 'Primary analysis objective', NULL, FALSE);

-- Variables for Code Review Follow-up (id=3)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (3, 'file_name', 'File being reviewed', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (3, 'issue_category', 'Category of issues to focus on', 'performance', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (3, 'specific_issue', 'Specific issue to explain', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (3, 'coding_standard', 'Coding standard to follow', 'Clean Code', FALSE);

-- Variables for Email Draft Helper (id=4)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'email_type', 'Type of email (e.g., follow-up, introduction)', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'recipient_role', 'Role of the email recipient', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'subject', 'Email subject line', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'key_points', 'Main points to include', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'tone', 'Desired tone of the email', 'professional', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (4, 'signature', 'Email sign-off name', NULL, FALSE);

-- Variables for API Documentation Generator (id=5)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'doc_format', 'Documentation format', 'OpenAPI', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'http_method', 'HTTP method (GET, POST, etc.)', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'endpoint_path', 'API endpoint path', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'endpoint_description', 'What the endpoint does', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'request_body', 'Request body schema or example', NULL, FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (5, 'style_guide', 'Documentation style guide to follow', 'Google API Design Guide', FALSE);

-- Variables for Database Schema Designer (id=7)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (7, 'project_name', 'Name of the project', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (7, 'requirements', 'Schema requirements and use cases', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (7, 'database_type', 'Target database system', 'PostgreSQL', TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (7, 'constraints', 'Additional design constraints', NULL, FALSE);

-- Variables for Customer Support Bot (id=6)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (6, 'bot_name', 'Display name for the support bot', 'SupportBot', TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (6, 'company_name', 'Name of the company', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (6, 'support_category_1', 'First support category', 'Billing & Payments', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (6, 'support_category_2', 'Second support category', 'Technical Issues', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (6, 'support_category_3', 'Third support category', 'Account Management', FALSE);

-- Reset auto-increment sequences to avoid PK conflicts with new inserts
ALTER TABLE prompts ALTER COLUMN id RESTART WITH 100;
ALTER TABLE prompt_variables ALTER COLUMN id RESTART WITH 100;
