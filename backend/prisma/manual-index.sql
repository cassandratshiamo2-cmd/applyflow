CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_createdAt_idx"
ON "Notification"("userId", "isRead", "createdAt");
