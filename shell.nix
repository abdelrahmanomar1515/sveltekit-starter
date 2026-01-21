{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    bun
  ];

  buildInputs = with pkgs; [
    docker-compose
  ];
}
