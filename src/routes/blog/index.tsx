import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePublicPosts } from "@/functions/blog-client";

export const Route = createFileRoute("/blog/")({
  component: BlogListPage,
});

function BlogListPage() {
  const [titleInput, setTitleInput] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [applied, setApplied] = useState<{ title?: string }>({});

  const query = usePublicPosts({
    title: applied.title,
    page,
    limit,
  });

  function handleSearch() {
    setPage(1);
    setApplied({ title: titleInput.trim() ? titleInput.trim() : undefined });
  }

  function handleClear() {
    setTitleInput("");
    setPage(1);
    setApplied({});
  }

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Buscar por título"
            className="max-w-xs"
          />
          <Button type="submit">Buscar</Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        </form>

        {query.isPending && <p className="text-sm">Cargando…</p>}
        {query.isError && (
          <p className="text-sm text-destructive">Error al cargar el blog.</p>
        )}
        {query.isSuccess && items.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin resultados.</p>
        )}

        {items.length > 0 && (
          <div className="grid gap-4">
            {items.map((post) => (
              <Card key={post.id}>
                <CardContent className="flex gap-4">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-24 w-36 shrink-0 rounded-lg border object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2">
                    <h2 className="text-lg font-semibold">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                      >
                        Leer más
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} · {total} publicaciones
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || query.isPending}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || query.isPending}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
