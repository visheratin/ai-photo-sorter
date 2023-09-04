"use client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollectionsPage from "./collections/page";
import NewCollectionPage from "./collections/new/page";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderComponent from "@/components/header";
import FooterComponent from "@/components/footer";

export default function Page({ params }: { params: { lng: string } }) {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  if (isServer) return null;
  const router = createBrowserRouter([
    {
      path: `/${params.lng}`,
      element: (
        <>
          <HeaderComponent lng={params.lng} />
          <main className="relative flex min-h-[calc(100vh-9.6rem)] flex-col">
            <Link to={`/${params.lng}/collections/new`}>New Collection</Link>
          </main>
          <FooterComponent lng={params.lng} />
        </>
      ),
    },
    {
      path: `/${params.lng}/collections`,
      element: (
        <>
          <HeaderComponent lng={params.lng} />
          <main className="relative flex min-h-[calc(100vh-9.6rem)] flex-col">
            <CollectionsPage params={{ lng: params.lng }} />
          </main>
          <FooterComponent lng={params.lng} />
        </>
      ),
    },
    {
      path: `/${params.lng}/collections/new`,
      element: (
        <>
          <HeaderComponent lng={params.lng} />
          <main className="relative flex min-h-[calc(100vh-9.6rem)] flex-col">
            <NewCollectionPage params={{ lng: params.lng }} />
          </main>
          <FooterComponent lng={params.lng} />
        </>
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
