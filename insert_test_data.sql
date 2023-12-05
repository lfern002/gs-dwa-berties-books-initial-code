-- insert_test_data.sql

-- Insert test users
INSERT INTO users (username, password) VALUES ('user1', 'password1');
INSERT INTO users (username, password) VALUES ('user2', 'password2');

-- Insert test topics
INSERT INTO topics (topic_name) VALUES ('Topic 1');
INSERT INTO topics (topic_name) VALUES ('Topic 2');

-- Assign users to topics (Memberships)
INSERT INTO memberships (user_id, topic_id) VALUES (1, 1);
INSERT INTO memberships (user_id, topic_id) VALUES (2, 2);

-- Insert test posts
INSERT INTO posts (user_id, topic_id, text) VALUES (1, 1, 'Post 1 in Topic 1');
INSERT INTO posts (user_id, topic_id, text) VALUES (2, 2, 'Post 1 in Topic 2');
INSERT INTO posts (user_id, topic_id, text) VALUES (1, 1, 'Post 2 in Topic 1');
INSERT INTO posts (user_id, topic_id, text) VALUES (2, 2, 'Post 2 in Topic 2');
