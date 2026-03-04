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

-- 8. Git Commit Message Writer (USER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (8, 'Git Commit Message Writer', 'Helps write clear and conventional git commit messages from a diff summary', 'USER',
'Write a git commit message for the following changes:

Repository: {{repo_name}}
Changed files: {{changed_files}}

Diff summary:
{{diff_summary}}

Follow the {{commit_convention}} commit convention.
{{#ticket_id}}Reference ticket: {{ticket_id}}{{/ticket_id}}

Keep the subject line under 72 characters and use imperative mood.',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 9. Unit Test Generator (SYSTEM, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (9, 'Unit Test Generator', 'System prompt for generating comprehensive unit tests for given code', 'SYSTEM',
'You are a test engineering expert specializing in {{language}} and {{test_framework}}.

Generate unit tests for the following code:
{{source_code}}

Requirements:
- Cover happy path, edge cases, and error scenarios
- Use {{assertion_style}} assertion style
- Aim for at least {{coverage_target}} code coverage
{{#mock_dependencies}}Mock the following dependencies: {{mock_dependencies}}{{/mock_dependencies}}',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 10. Meeting Summary Creator (USER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (10, 'Meeting Summary Creator', 'Creates structured meeting summaries with action items from raw notes', 'USER',
'Summarize the following meeting notes into a structured format:

Meeting: {{meeting_title}}
Date: {{meeting_date}}
Attendees: {{attendees}}

Raw notes:
{{raw_notes}}

Please provide:
1. A brief summary (2-3 sentences)
2. Key decisions made
3. Action items with owners and deadlines
{{#follow_up_date}}Next meeting: {{follow_up_date}}{{/follow_up_date}}',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 11. REST API Error Handler (SYSTEM, DRAFT)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (11, 'REST API Error Handler', 'Generates standardized error handling code for REST API endpoints', 'SYSTEM',
'You are a backend engineer creating error handling for a {{framework}} REST API.

Endpoint: {{http_method}} {{endpoint_path}}
Description: {{endpoint_description}}

Generate error handling that covers:
- Input validation errors (400)
- Authentication/authorization errors (401/403)
- Resource not found (404)
- Business logic errors (422)
- Internal server errors (500)

Use {{error_format}} error response format.
{{#custom_error_codes}}Include custom error codes: {{custom_error_codes}}{{/custom_error_codes}}',
'DRAFT', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 12. Python Code Reviewer (FOLLOW_UP, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (12, 'Python Code Reviewer', 'Follow-up review focused on Python-specific code quality and idioms', 'FOLLOW_UP',
'Continue the code review for {{module_name}} focusing on Python-specific improvements.

Review the following code:
{{code_snippet}}

Check for:
1. Pythonic idioms and PEP 8 compliance
2. Type hint completeness (target: {{type_hint_coverage}})
3. Proper use of {{python_version}} features
4. Error handling with specific exception types
{{#performance_focus}}Also analyze performance for: {{performance_focus}}{{/performance_focus}}',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 13. Product Requirements Writer (STARTER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (13, 'Product Requirements Writer', 'Starter prompt for drafting product requirement documents from feature ideas', 'STARTER',
'I need help writing a product requirements document for {{feature_name}}.

Product: {{product_name}}
Target users: {{target_audience}}

Feature idea:
{{feature_description}}

Please create a PRD that includes:
- Problem statement
- User stories in {{story_format}} format
- Acceptance criteria
- Success metrics
{{#technical_constraints}}Technical constraints: {{technical_constraints}}{{/technical_constraints}}',
'ACTIVE', 1, 'admin', 'admin', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 14. Regex Pattern Helper (USER, ACTIVE)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (14, 'Regex Pattern Helper', 'Assists with creating, explaining, and testing regular expressions', 'USER',
'Help me with a regular expression for {{regex_purpose}}.

Target language/engine: {{regex_engine}}

Examples of strings that should match:
{{match_examples}}

Examples of strings that should NOT match:
{{non_match_examples}}

{{#flags}}Use these flags: {{flags}}{{/flags}}

Please provide:
1. The regex pattern
2. A plain-English explanation of each part
3. Edge cases to consider',
'ACTIVE', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 15. Release Notes Generator (SYSTEM, ARCHIVED)
INSERT INTO prompts (id, name, description, type, template_body, status, version, created_by, updated_by, display_order, created_at, updated_at)
VALUES (15, 'Release Notes Generator', 'Generates user-friendly release notes from git logs and ticket descriptions', 'SYSTEM',
'You are a technical writer generating release notes for {{product_name}} version {{version_number}}.

Changelog entries:
{{changelog_entries}}

{{#breaking_changes}}Breaking changes:
{{breaking_changes}}{{/breaking_changes}}

Generate release notes that:
- Group changes by category (Features, Fixes, Improvements)
- Use clear, non-technical language for {{target_audience}}
- Highlight the most impactful changes first
- Follow {{release_format}} format',
'ARCHIVED', 1, 'admin', 'admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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

-- Tags for Git Commit Message Writer (id=8)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (8, 'git');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (8, 'productivity');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (8, 'developer-tools');

-- Tags for Unit Test Generator (id=9)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (9, 'testing');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (9, 'automation');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (9, 'code-quality');

-- Tags for Meeting Summary Creator (id=10)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (10, 'meetings');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (10, 'productivity');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (10, 'summarization');

-- Tags for REST API Error Handler (id=11)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (11, 'api');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (11, 'error-handling');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (11, 'rest');

-- Tags for Python Code Reviewer (id=12)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (12, 'python');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (12, 'code-review');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (12, 'best-practices');

-- Tags for Product Requirements Writer (id=13)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (13, 'product-management');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (13, 'requirements');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (13, 'agile');

-- Tags for Regex Pattern Helper (id=14)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (14, 'regex');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (14, 'developer-tools');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (14, 'automation');

-- Tags for Release Notes Generator (id=15)
INSERT INTO prompt_tags (prompt_id, tag) VALUES (15, 'documentation');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (15, 'release-management');
INSERT INTO prompt_tags (prompt_id, tag) VALUES (15, 'changelog');

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

-- Variables for Git Commit Message Writer (id=8)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (8, 'repo_name', 'Name of the repository', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (8, 'changed_files', 'List of changed files', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (8, 'diff_summary', 'Summary of the code changes', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (8, 'commit_convention', 'Commit message convention to follow', 'Conventional Commits', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (8, 'ticket_id', 'Related ticket or issue ID', NULL, FALSE);

-- Variables for Unit Test Generator (id=9)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'language', 'Programming language of the source code', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'test_framework', 'Testing framework to use', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'source_code', 'Code to generate tests for', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'assertion_style', 'Assertion style preference', 'BDD', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'coverage_target', 'Target code coverage percentage', '80%', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (9, 'mock_dependencies', 'Dependencies to mock in tests', NULL, FALSE);

-- Variables for Meeting Summary Creator (id=10)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (10, 'meeting_title', 'Title of the meeting', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (10, 'meeting_date', 'Date the meeting took place', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (10, 'attendees', 'List of meeting attendees', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (10, 'raw_notes', 'Raw meeting notes to summarize', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (10, 'follow_up_date', 'Date for the next follow-up meeting', NULL, FALSE);

-- Variables for REST API Error Handler (id=11)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'framework', 'Backend framework being used', 'Spring Boot', TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'http_method', 'HTTP method of the endpoint', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'endpoint_path', 'API endpoint path', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'endpoint_description', 'What the endpoint does', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'error_format', 'Error response format standard', 'RFC 7807 Problem Details', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (11, 'custom_error_codes', 'Custom application error codes', NULL, FALSE);

-- Variables for Python Code Reviewer (id=12)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (12, 'module_name', 'Name of the Python module being reviewed', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (12, 'code_snippet', 'Python code to review', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (12, 'type_hint_coverage', 'Target type hint coverage level', 'full', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (12, 'python_version', 'Target Python version', '3.11', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (12, 'performance_focus', 'Specific performance areas to analyze', NULL, FALSE);

-- Variables for Product Requirements Writer (id=13)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'feature_name', 'Name of the feature', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'product_name', 'Name of the product', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'target_audience', 'Target user audience', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'feature_description', 'Description of the feature idea', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'story_format', 'User story format to use', 'As a... I want... So that...', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (13, 'technical_constraints', 'Technical constraints to consider', NULL, FALSE);

-- Variables for Regex Pattern Helper (id=14)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (14, 'regex_purpose', 'What the regex should match or extract', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (14, 'regex_engine', 'Target regex engine or language', 'JavaScript', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (14, 'match_examples', 'Strings that should match the pattern', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (14, 'non_match_examples', 'Strings that should not match', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (14, 'flags', 'Regex flags to use', NULL, FALSE);

-- Variables for Release Notes Generator (id=15)
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'product_name', 'Name of the product', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'version_number', 'Release version number', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'changelog_entries', 'Raw changelog or git log entries', NULL, TRUE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'breaking_changes', 'List of breaking changes if any', NULL, FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'target_audience', 'Target audience for the notes', 'end users', FALSE);
INSERT INTO prompt_variables (prompt_id, name, description, default_value, required) VALUES (15, 'release_format', 'Release notes format', 'Keep a Changelog', FALSE);

-- Reset auto-increment sequences to avoid PK conflicts with new inserts
ALTER TABLE prompts ALTER COLUMN id RESTART WITH 100;
ALTER TABLE prompt_variables ALTER COLUMN id RESTART WITH 100;
