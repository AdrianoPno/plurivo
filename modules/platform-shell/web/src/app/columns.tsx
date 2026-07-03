"use client";

import { MoreHorizontal } from "lucide-react";

import { MODULE_CONFIGS } from "@shared/constants/modules";
import type { IUser } from "@shared/types/user";
import type { Tenant } from "@shared/types/tenant";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import type { Column } from "@shared/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

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
        <DropdownMenuLabel>Acoes</DropdownMenuLabel>
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

export const getColumns = (
  actions: Omit<UserActionsProps, "user">,
  tenants: Tenant[] = [],
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
    title: "Permissao global",
    render: (_, user) => <Badge variant="outline">{user.role}</Badge>,
  },
  {
    key: "tenantId",
    title: "Organizacao",
    render: (_, user) => {
      if (user.role === "SUPER") return <Badge variant="outline">Plataforma</Badge>;
      return tenants.find((tenant) => tenant.id === user.tenantId)?.branding.displayName || "Nao vinculada";
    },
  },
  {
    key: "permissions",
    title: "Modulos",
    render: (_, user) => {
      if (user.role === "SUPER") {
        return <Badge variant="outline">Todos</Badge>;
      }

      if (!user.permissions?.length) {
        return <span className="text-sm text-muted-foreground">Sem acesso</span>;
      }

      return (
        <div className="flex max-w-[320px] flex-wrap gap-1.5">
          {user.permissions.map((permission) => {
            const moduleConfig = MODULE_CONFIGS.find(
              (module) => module.id === permission.moduleId,
            );

            return (
              <Badge
                key={permission.moduleId}
                variant="secondary"
                className="font-normal"
              >
                {moduleConfig?.name || permission.moduleId}: {permission.role}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    key: "unidadeNome",
    title: "Unidade",
    render: (_, user) => user.unidadeNome || "Nao vinculada",
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
    title: "Acoes",
    render: (_, user) => <UserActions user={user} {...actions} />,
  },
];
