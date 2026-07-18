# Database Schema (Design)

Core entities:
- users
- user_preferences
- notifications (partitioned by created_at month)
- notification_state_log
- dead_letter_queue
- templates
- delivery_providers
- consent_records

Indexes:
- notifications(user_id, created_at desc)
- notifications(status, priority)
- notification_state_log(notification_id, created_at)
- dead_letter_queue(reason, created_at)
