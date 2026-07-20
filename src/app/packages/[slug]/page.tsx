import { notFound } from "next/navigation";
import { packages } from "@/lib/data";
import type { Package } from "@/lib/data";
import { PackageDetailsClient } from "@/components/package-details";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const awaitedParams = await params;
  const pkg = packages.find((p) => p.slug === awaitedParams.slug);

  if (!pkg) {
    return {
      title: "Package Not Found",
    };
  }

  return {
    title: pkg.name,
    description: pkg.description,
    openGraph: {
      title: pkg.name,
      description: pkg.description,
      images: [
        {
          url: pkg.image,
          width: 600,
          height: 400,
          alt: pkg.name,
        },
      ],
    },
  };
}

export default async function PackageDetailsPage({ params }: Props) {
  const awaitedParams = await params;
  const pkg = packages.find((p) => p.slug === awaitedParams.slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetailsClient pkg={pkg} />;
}
