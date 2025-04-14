type Props = {
  params: Promise<{ id: string }>;
};

export async function DynamicPost({ params }: Props) {
  const id = (await params).id;

  console.log(id);
}
