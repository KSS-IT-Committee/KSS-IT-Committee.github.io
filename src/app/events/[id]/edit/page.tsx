/**
 * Edit Event Page
 *
 * Server component that renders the edit event form.
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import { AuthGuard } from "@/components/AuthGuard";

import { EditEventClient } from "./EditEventClient";

export default async function EditEventPage() {
  return (
    <AuthGuard>
      <EditEventClient />
    </AuthGuard>
  );
}
