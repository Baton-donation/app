import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider, useDispatch } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "../components/link";
import configureStore from "../store/configure-store";
import { loadFromDatabase } from "../store/sentences/actions";

const LINKS = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

const store = configureStore();

interface IOptionalBreadcrumb {
  name: string;
  href: string;
}

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load data into store
    dispatch(loadFromDatabase());
  }, []);

  const breadcrumbLink = (Component as any).breadcrumb as IOptionalBreadcrumb;

  return (
    <>
      <Head>
        <title>Baton</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <CssBaseline />

      <Container>
        <Toolbar
          style={{ marginTop: "1rem", marginBottom: "1rem", paddingRight: 0 }}
        >
          {breadcrumbLink && (
            <Link
              href={breadcrumbLink.href}
              variant="h6"
              style={{ marginLeft: "auto" }}
            >
              {breadcrumbLink.name}
            </Link>
          )}
        </Toolbar>

        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default function WrappedApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <MyApp Component={Component} pageProps={pageProps} router={router} />
    </Provider>
  );
}
