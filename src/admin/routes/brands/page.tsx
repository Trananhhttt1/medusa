import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil, PlusMini, Spinner, TagSolid, Trash } from "@medusajs/icons";
import {
  Button,
  Container,
  Divider,
  FocusModal,
  Heading,
  Input,
  Label,
  Prompt,
  Table,
  Textarea,
  toast,
  useToggleState,
} from "@medusajs/ui";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";
import { sdk } from "../../lib/config";

const BrandsPage = () => {
  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Name", key: "title", class: "" },
    { title: "Action", key: "action", class: "w-[100px] text-center" },
  ];
  const [createOpen, showCreate, closeCreate] = useToggleState();
  const [updateOpen, showUpdate, closeUpdate] = useToggleState();
  const [confirmOpen, showConfirm, closeConfirm] = useToggleState();
  const [brandInput, setBrandInput] = useState({
    name: "",
    description: "",
  });
  const [brandIdEdit, setBranIdEdit] = useState(null);
  const [brandInputUpdate, setBrandInputUpdate] = useState({
    name: "",
    description: "",
  });
  const [brandIdDelete, setBrandIdDelete] = useState(null);

  const [validateForm, setValidateForm] = useState<{
    name?: string;
    description?: string;
  }>({});

  // TODO retrieve brands
  const [params, setParams] = useState({
    limit: 10,
    offset: 0,
  });

  //get brand all:
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["list-brand", JSON.stringify({ ...params })],
    queryFn: () =>
      sdk.client.fetch("/admin/brands", {
        query: params,
      }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  //get brand id:
  const { data: dataBrandEdit, isLoading: isLoadingBrandEdit } = useQuery<any>({
    queryKey: ["get-one-brand", brandIdEdit],
    queryFn: () =>
      sdk.client.fetch(`/admin/brands/get-one-brand?id=${brandIdEdit}`, {
        query: params,
      }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!brandIdEdit,
  });
  console.log("data id:", dataBrandEdit);

  useEffect(() => {
    if (dataBrandEdit) {
      setBrandInputUpdate({
        name: dataBrandEdit.data.name,
        description: dataBrandEdit.data.description,
      });
    }
  }, [dataBrandEdit]);

  useEffect(() => {
    setBrandInput({ name: "", description: "" });
    setValidateForm({});
  }, [createOpen, updateOpen]);

  //post data
  const { mutate: mutateCreateBrand, isPending: isLoadingCreate } = useMutation(
    {
      mutationFn: (data: { name: string; description: string }) =>
        sdk.client.fetch("/admin/brands", {
          method: "post",
          body: data,
        }),
    }
  );

  const onSave = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (brandInput.name.trim() === "" || !brandInput.name) {
      newErrors.name = " * Name không được để trống !";
    }
    if (brandInput.description.trim() === "" || !brandInput.description) {
      newErrors.description = " * Description không được để trống !";
    }
    setValidateForm(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    mutateCreateBrand(brandInput, {
      onSuccess: () => {
        closeCreate();
        refetch();
        toast.success("Create Brand successfully");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  //update data
  const { mutate: mutateUpdateBrand, isPending: isLoadingUpdate } = useMutation(
    {
      mutationFn: (data: { id: string; name: string; description: string }) =>
        sdk.client.fetch("/admin/brands/update", {
          method: "post",
          body: data,
        }),
    }
  );
  const onSaveUpdate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (brandInputUpdate.name.trim() === "" || !brandInputUpdate.name) {
      newErrors.name = " * Name không được để trống !";
    }
    if (
      brandInputUpdate.description.trim() === "" ||
      !brandInputUpdate.description
    ) {
      newErrors.description = " * Description không được để trống !";
    }
    setValidateForm(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    mutateUpdateBrand(
      { ...brandInputUpdate, id: brandIdEdit },
      {
        onSuccess: () => {
          closeUpdate();
          refetch();
          toast.success("Update blog successfully");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  //delete brand:
  const { mutate: mutateDeleteBrand, isPending: isLoadingDelete } = useMutation(
    {
      mutationFn: (id: string) =>
        sdk.client.fetch(`/admin/brands?id=${id}`, {
          method: "delete",
        }),
    }
  );
  const handleOnDelete = () => {
    mutateDeleteBrand(brandIdDelete, {
      onSuccess: () => {
        closeConfirm();
        refetch();
        toast.success("Delete Brand successfully");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  console.log("data");
  console.log(data);

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4 ">
        <Heading level="h1" className="font-sans font-medium h1-core">
          Manage Brand
        </Heading>
        <Button
          onClick={() => {
            showCreate();
          }}
        >
          Create <PlusMini />
        </Button>
      </div>
      <div className="flex w-full h-full flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center bg-white bg-opacity-50 w-full min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                {columns.map((e) => (
                  <Table.HeaderCell key={e.key} className={e.class}>
                    {e.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data &&
                data?.count > 0 &&
                data.data.map((item, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell className="flex justify-center">
                        <Button
                          variant="transparent"
                          onClick={() => {
                            showConfirm();
                            setBrandIdDelete(item.id);
                          }}
                        >
                          <Trash />
                        </Button>
                        <Button
                          variant="transparent"
                          onClick={() => {
                            showUpdate();
                            setBranIdEdit(item.id);
                          }}
                        >
                          <Pencil />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* model Create */}
      <FocusModal
        open={createOpen}
        onOpenChange={(modalOpened) => {
          if (!modalOpened) {
            closeCreate();
          }
        }}
      >
        <FocusModal.Content className="w-[500px] m-auto h-[300px]">
          <FocusModal.Header>
            <Button onClick={onSave}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-8">
            <div>
              <div>
                <Label size="small">Name</Label>
                <Input
                  placeholder="Enter Name ..."
                  id="input-id"
                  value={brandInput.name}
                  onChange={(e) => {
                    setBrandInput({ ...brandInput, name: e.target.value });
                  }}
                />
                {validateForm.name && (
                  <p className="text-red-500 italic text-xs">
                    {validateForm.name}
                  </p>
                )}
              </div>
              <div>
                <Label size="small">Descriptoion</Label>
                <Textarea
                  placeholder="Enter Description ..."
                  value={brandInput.description}
                  onChange={(e) => {
                    setBrandInput({
                      ...brandInput,
                      description: e.target.value,
                    });
                  }}
                />
                {validateForm.description && (
                  <p className="text-red-500 italic text-xs">
                    {validateForm.description}
                  </p>
                )}
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* model update */}
      <FocusModal
        open={updateOpen}
        onOpenChange={(modalOpened) => {
          if (!modalOpened) {
            closeUpdate();
          }
        }}
      >
        <FocusModal.Content className="w-[500px] m-auto h-[300px]">
          <FocusModal.Header>
            <Button onClick={onSaveUpdate}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-8">
            <div className="">
              <div>
                <Label size="small">Name</Label>
                <Input
                  placeholder="Placeholder"
                  id="input-id"
                  value={brandInputUpdate.name}
                  onChange={(e) => {
                    setBrandInputUpdate({
                      ...brandInputUpdate,
                      name: e.target.value,
                    });
                  }}
                />
                {validateForm.name && (
                  <p className="text-red-500 italic text-xs">
                    {validateForm.name}
                  </p>
                )}
              </div>
              <div>
                <Label size="small">Descriptoion</Label>
                <Textarea
                  placeholder="Product description ..."
                  value={brandInputUpdate.description}
                  onChange={(e) => {
                    setBrandInputUpdate({
                      ...brandInputUpdate,
                      description: e.target.value,
                    });
                  }}
                />
                {validateForm.name && (
                  <p className="text-red-500 italic text-xs">
                    {validateForm.description}
                  </p>
                )}
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
      {/* model confirm */}
      <Prompt open={confirmOpen}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Xác nhận xóa</Prompt.Title>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={closeConfirm}>Cancel</Prompt.Cancel>
            <Prompt.Action onClick={handleOnDelete}>
              {isLoadingDelete ? <Spinner /> : "Xác Nhận"}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>

      {isLoadingCreate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-10 flex items-center justify-center ">
          <Spinner />
        </div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
});

export default BrandsPage;
