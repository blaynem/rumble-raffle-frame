"use client";
import Home from "./Home";
import Nav from "./components/nav";
import { PreferencesProvider } from "./containers/preferences";

export default function PageIndex() {
  return (
    <PreferencesProvider>
      <Nav />
      <Home />
    </PreferencesProvider>
  );
}
