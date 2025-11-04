
import { MDXRemote } from 'next-mdx-remote/rsc';

export default function MDXContent({ source }: { source: string }){
  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote source={source} />
    </article>
  );
}
