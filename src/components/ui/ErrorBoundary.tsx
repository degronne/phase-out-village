import React from "react";

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Minimal logging for diagnosis
    // eslint-disable-next-line no-console
    console.error("Tutorial crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2>Noe gikk galt i veiledningen</h2>
          <p style={{ fontSize: "0.95rem" }}>
            Veiledningen støtte på en feil og ble stoppet. Du kan lukke den og
            prøve igjen, eller fortsette å bruke appen.
          </p>
          <details>
            <summary>Detaljer</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.message}</pre>
          </details>
          {this.props.children && null}
        </div>
      );
    }
    return this.props.children;
  }
}
