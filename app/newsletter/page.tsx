import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function NewsLetter() {
  // Fetch the session
  const session = await getServerSession(authOptions);

  // Redirect to login if the user is not authenticated
  if (!session) {
    redirect("/login");
  }

  // Fetch subscribers data from your backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscribers");
  }

  const subscribers = await response.json();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Newsletter Management</h1>
          <p className="text-sm text-muted-foreground">Manage newsletter subscribers here.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber: any) => (
              <tr key={subscriber._id}>
                <td className="px-4 py-2">{subscriber.email}</td>
                <td className="px-4 py-2">{new Date(subscriber.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}