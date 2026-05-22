"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

const userFormSchema = z
  .object({
    nome: z.string().min(2, "O nome é obrigatório."),
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().optional(),
    role: z.string({ required_error: "A permissão é obrigatória." }),
    isEditing: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEditing && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "A senha provisória deve ter no mínimo 6 caracteres.",
      });
    }
  });

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<UserFormData> | null;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: UserFormDialogProps) {
  const isEditing = !!initialData;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      role: "USER",
      isEditing: false,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "USER",
      isEditing,
    });
  }, [form, initialData, isEditing, open]);

  const onSubmit = (data: UserFormData) => {
    const { isEditing, ...userData } = data;

    if (isEditing && (!userData.password || userData.password.length === 0)) {
      delete userData.password;
    }

    console.log("Dados para API:", userData);

    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-border/70 p-0 shadow-2xl sm:max-w-[520px]">
        <DialogHeader className="border-b border-border/70 bg-muted/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {isEditing ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>

            <div>
              <DialogTitle className="text-xl">
                {isEditing ? "Editar usuário" : "Criar novo usuário"}
              </DialogTitle>

              <DialogDescription className="mt-1">
                {isEditing
                  ? "Atualize as informações e permissões deste usuário."
                  : "Preencha os dados para cadastrar um novo acesso."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Nome do usuário"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="email@recicleiros.com.br"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha provisória</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Mínimo de 6 caracteres"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissão global</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma permissão" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER">Super</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 gap-2 border-t border-border/70 pt-5 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                {isEditing ? "Salvar alterações" : "Criar usuário"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
