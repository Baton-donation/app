import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { isFirstOpen } from "../lib/api";

const EntryPoint = () => {
  const router = useRouter();

  const redirect = useCallback(
    () =>
      isFirstOpen()
        .then((firstOpen) => {
          if (firstOpen) {
            router.push("/setup/1");
          } else {
            router.push("/dashboard");
          }
        })
        .catch(() => {
          setTimeout(redirect, 200);
        }),
    [router]
  );

  useEffect(() => {
    setTimeout(() => {
      redirect();
    }, 200);
  }, [redirect]);

  return <div />;
};

export default EntryPoint;
