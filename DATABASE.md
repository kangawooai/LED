# Database map — Leads Everyday

Generated from the live database. Do not edit by hand: it is rewritten after any build that changes the schema, and your edits would be lost.

6 tables are readable. Anything not listed here is deliberately out of reach — credentials, payments and personal records are excluded by policy, not by oversight.

## At a glance

| Table | Rows | What it links to |
| --- | ---: | --- |
| `proposal_progress` | 562 | — |
| `proposal_edit_history` | 224 | — |
| `campaigns` | 18 | user_id → users |
| `app_configuration` | 6 | updated_by → users |
| `account_settings` | 1 | user_id → users |
| `api_usage` | 0 | user_id → users |

## proposal_progress

562 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | uuid | no | — |
| `lead_id` | text | no | — |
| `monthly_fee` | numeric | no | — |
| `setup_fee` | text | no | — |
| `total_fee` | text | no | — |
| `industry` | text | no | — |
| `service` | text | no | — |
| `target_area` | text | no | — |
| `required_leads` | text | no | — |
| `conversion_rate` | text | no | — |
| `custom_leads` | text | yes | — |
| `proposal_accepted` | boolean | no | default `false` |
| `completed_steps` | text[] | no | default `'{}'::text[]` |
| `active_section` | text | yes | — |
| `created_at` | timestamp with time zone | no | default `now()` |
| `updated_at` | timestamp with time zone | no | default `now()` |
| `first_name` | text | yes | — |
| `last_name` | text | yes | — |
| `email` | text | yes | — |
| `phone` | text | yes | — |
| `business_name` | text | yes | — |
| `company_address` | text | yes | — |
| `company_number` | text | yes | — |
| `street_address` | text | yes | — |
| `city` | text | yes | — |
| `country` | text | yes | — |
| `post_code` | text | yes | — |
| `billing_day` | integer | yes | — |
| `linked_id` | text | yes | — |
| `stripe_customer_id` | text | yes | — |
| `stripe_payment_id` | text | yes | — |
| `opportunity_id` | text | yes | — |
| `bypass_details` | boolean | yes | default `false` |
| `avg_job_value` | numeric | yes | default `0` |
| `desired_return` | numeric | yes | default `0` |
| `pandadoc_document_id` | text | yes | — |
| `pandadoc_status` | text | yes | one of: `document.completed`, `document.voided`, `document.sent`, `pending`; default `'pending'::text` |
| `yhc` | text | yes | — |
| `auto_login_used` | boolean | yes | default `false` |
| `radius` | text | yes | — |
| `manager_name` | text | yes | — |
| `manager_email` | text | yes | — |

## proposal_edit_history

224 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | uuid | no | — |
| `lead_id` | text | no | — |
| `field` | text | no | — |
| `field_label` | text | no | — |
| `old_value` | text | yes | — |
| `new_value` | text | yes | — |
| `created_at` | timestamp with time zone | yes | default `now()` |

## campaigns

18 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | uuid | no | — |
| `user_id` | uuid | yes | → `users.id` |
| `stage` | text | no | — |
| `name` | text | no | — |
| `description` | text | yes | — |
| `service` | text | no | — |
| `target_area` | text | no | — |
| `customers_required` | integer | no | — |
| `monthly_fee` | numeric(10,2) | no | — |
| `currency` | text | no | default `'GBP'::text` |
| `billing_day` | integer | no | — |
| `proposal_status` | text | yes | one of: `pending`, `accepted`, `expired` |
| `setup_fee` | numeric(10,2) | yes | — |
| `expires_at` | timestamp with time zone | yes | — |
| `campaign_status` | text | yes | one of: `paused`, `active` |
| `current_spend` | numeric(10,2) | yes | default `0` |
| `budget_limit` | numeric(10,2) | yes | — |
| `total_leads` | integer | yes | default `0` |
| `total_jobs_won` | integer | yes | default `0` |
| `start_date` | timestamp with time zone | yes | — |
| `current_period_start` | timestamp with time zone | yes | — |
| `next_billing_date` | timestamp with time zone | yes | — |
| `billing_anchor_date` | timestamp with time zone | yes | — |
| `billing_day_rule` | text | yes | default `'exact'::text` |
| `last_paid_period` | text | yes | — |
| `next_due_period` | text | yes | — |
| `next_due_date` | timestamp with time zone | yes | — |
| `created_at` | timestamp with time zone | no | default `now()` |
| `updated_at` | timestamp with time zone | no | default `now()` |
| `last_billed_date` | timestamp with time zone | yes | — |
| `billing_pause_date` | timestamp with time zone | yes | — |
| `billing_resume_date` | timestamp with time zone | yes | — |
| `salesforce_id` | text | yes | — |
| `salesforce_synced_at` | timestamp with time zone | yes | — |
| `proposal_lead_id` | text | yes | — |
| `opportunity_id` | text | yes | — |
| `linked_id` | text | yes | — |
| `industry` | text | yes | — |
| `required_leads` | text | yes | — |
| `conversion_rate` | text | yes | — |
| `custom_leads` | text | yes | — |
| `total_fee` | text | yes | — |
| `first_name` | text | yes | — |
| `last_name` | text | yes | — |
| `email` | text | yes | — |
| `phone` | text | yes | — |
| `business_name` | text | yes | — |
| `company_address` | text | yes | — |
| `company_number` | text | yes | — |
| `stripe_customer_id` | text | yes | — |
| `stripe_payment_id` | text | yes | — |

## app_configuration

6 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | uuid | no | — |
| `key` | text | no | — |
| `value` | text | no | — |
| `is_public` | boolean | yes | default `false` |
| `description` | text | yes | — |
| `updated_at` | timestamp with time zone | no | default `now()` |
| `updated_by` | uuid | yes | → `users.id` |

## account_settings

1 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `user_id` | uuid | no | → `users.id` |
| `notify_new_leads` | boolean | no | default `true` |
| `notify_new_proposals` | boolean | no | default `true` |
| `sync_jobs_to_calendar` | boolean | no | default `true` |
| `sync_lead_visits_to_calendar` | boolean | no | default `true` |
| `selected_calendar_id` | text | yes | — |
| `reminder_minutes_before` | integer | no | default `15` |
| `currency` | text | no | default `'GBP'::text` |
| `created_at` | timestamp with time zone | no | default `now()` |
| `updated_at` | timestamp with time zone | no | default `now()` |
| `work_schedule` | jsonb | no | default `'{"1": {"endTime": "17:00", "startTime": "09:00"}, "2": {"endTime": "17:00", "startTime": "09:00"}, "3": {"endTime": "17:00", "startTime": "09:00"}, "4": {"endTime": "17:00", "startTime": "09:00"}, "5": {"endTime": "17:00", "startTime": "09:00"}}'::jsonb` |
| `ical_feed_token` | text | yes | — |

## api_usage

0 rows.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | uuid | no | — |
| `user_id` | uuid | no | → `users.id` |
| `service` | text | no | — |
| `operation` | text | no | — |
| `tokens_used` | integer | yes | — |
| `cost_usd` | numeric(10,4) | yes | — |
| `metadata` | jsonb | yes | — |
| `created_at` | timestamp with time zone | no | default `now()` |

## The preview copy

This database has **no `preview` schema**, so a preview deployment reads and writes the live data. That is why admin screens are read-only on previews: a customer can see a change but never use it.

If this build adds or changes an admin screen the customer will want to TRY, say so in your summary and propose a preview schema as its own piece of work. Do not create one as a side effect of another change.

## Working with it

- Reads go through the site-data tools; they are read-only and limited to the tables above.
- Dates are stored as written here — check the column type before comparing, and work relative dates out from today rather than from memory.
- A count is a count: do not infer a total from a page of rows. Ask for the count.
- Changing data is a separate, charged action and must be agreed with the customer first.
