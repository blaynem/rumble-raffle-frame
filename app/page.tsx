import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   const frameTags = await getFrameMetadata(
//     `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
//   );
//   return {
//     other: frameTags,
//   };
// }

export default function Home(props: any) {
  return (
    <main>
      <h1>Wait a minute, that's illegal!</h1>
    </main>
  );
}
