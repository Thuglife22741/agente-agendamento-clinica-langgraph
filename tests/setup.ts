// Set dummy environment variables for testing
process.env["DATABASE_URL"] = "postgresql://test:test@localhost:5432/test";
process.env["OPENAI_API_KEY"] = "sk-test";
process.env["CHATWOOT_BASE_URL"] = "https://test.chatwoot.com";
process.env["CHATWOOT_API_TOKEN"] = "test-token";
process.env["CHATWOOT_ACCOUNT_ID"] = "8";
process.env["GOOGLE_CALENDAR_CREDENTIALS"] = '{"type":"service_account","project_id":"test"}';
process.env["ELEVENLABS_API_KEY"] = "xi-test";
process.env["ELEVENLABS_VOICE_ID"] = "test-voice";
process.env["CHATWOOT_ALERT_INBOX_ID"] = "27";
process.env["CHATWOOT_ALERT_CONVERSATION_ID"] = "15";
process.env["PROFISSIONAIS_CALENDAR_IDS"] = '{"dra-ana-cristina":"cal-ana","dra-ana-cristina":"cal-ricardo","dra-ana-cristina":"cal-beatriz","dra-ana-cristina":"cal-felipe"}';
