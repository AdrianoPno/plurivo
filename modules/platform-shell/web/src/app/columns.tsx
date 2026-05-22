"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Badge } from "@shared/ui/badge";
import { IUser } from "@shared/types/user";

// 1. IMPORTAR O TIPO DO SEU DATA-TABLE COMPARTILHADO
// (Mude o nome do import se no arquivo da UI ele for exportado com outro nome, ex: DataTableColumn)
import { Column } from "@shared/ui/data-table";

type UserActionsProps = {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
};

function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(user)}>Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(user)}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 2. FORÇAR A INTERSEÇÃO DE TIPO COM O "actions" PARA PARAR A RECLAMAÇÃO DO COMPILADOR
// O Omit e a união garantem que o tipo aceita as chaves de IUser MAIS a string fixada "actions"
type FixedUserColumn = Omit<Column<IUser>, "key"> & {
  key: keyof IUser | "actions";
};
export const getColumns = (
  actions: Omit<UserActionsProps, "user">,
): Column<IUser>[] => [
  {
    key: "nome",
    title: "Nome",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "role",
    title: "Permissão Global",
    render: (_, user) => <Badge variant="outline">{user.role}</Badge>,
  },
  {
    key: "unidadeNome",
    title: "Unidade",
    render: (_, user) => user.unidadeNome || "Não vinculada",
  },
  {
    key: "ativo",
    title: "Status",
    render: (_, user) => (
      <Badge variant={user.ativo ? "default" : "destructive"}>
        {user.ativo ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    render: (_, user) => <UserActions user={user} {...actions} />,
  },
];
