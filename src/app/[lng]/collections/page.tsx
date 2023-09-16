"use client";
import { useTranslation } from "@/app/i18n/client";
import { Collection } from "@/lib/collection";
import { Database } from "@/lib/database";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CollectionsPage({
  params,
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(params.lng, "collections");

  const [collections, setCollections] = useState<Collection[]>([]);

  const load = async () => {
    const collections = await Database.listCollections();
    setCollections(collections);
  };

  useEffect(() => {
    load();
  }, []);

  const formatTime = (time: number) => {
    const date = new Date(time);
    return `${date.toLocaleDateString(t("locale"))} ${date.toLocaleTimeString(
      t("locale")
    )}`;
  };

  return (
    <div className="container pt-10">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      {collections.length !== 0 && (
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>{t("table-title")}</TableHead>
              <TableHead>{t("table-number")}</TableHead>
              <TableHead>{t("table-time")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <Link to={`/${params.lng}/collections/${collection.id}`}>
                  <TableCell>{collection.title}</TableCell>
                </Link>
                <TableCell>{collection.filesNumber}</TableCell>
                <TableCell>{formatTime(collection.updateTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Link to={`/${params.lng}/collections/new`}>
        <Button className="mt-4">{t("create-new")}</Button>
      </Link>
    </div>
  );
}
