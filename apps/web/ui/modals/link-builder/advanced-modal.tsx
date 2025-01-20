import {
  Button,
  InfoTooltip,
  Modal,
  SimpleTooltipContent,
  Tooltip,
  useKeyboardShortcut,
} from "@dub/ui";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { useForm, useFormContext } from "react-hook-form";
import { LinkFormData } from ".";

function AdvancedModal({
  showAdvancedModal,
  setShowAdvancedModal,
}: {
  showAdvancedModal: boolean;
  setShowAdvancedModal: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("../ui/modals/link-builder");

  const id = useId();

  const {
    watch: watchParent,
    getValues: getValuesParent,
    setValue: setValueParent,
  } = useFormContext<LinkFormData>();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Pick<LinkFormData, "externalId" | "tenantId">>({
    values: {
      externalId: getValuesParent("externalId"),
      tenantId: getValuesParent("tenantId"),
    },
  });

  const [externalIdParent, tenantIdParent] = watchParent([
    "externalId",
    "tenantId",
  ]);

  useKeyboardShortcut("a", () => setShowAdvancedModal(true), {
    modal: true,
  });

  const parentEnabled = Boolean(externalIdParent || tenantIdParent);

  return (
    <Modal
      showModal={showAdvancedModal}
      setShowModal={setShowAdvancedModal}
      className="sm:max-w-[500px]"
    >
      <form
        className="px-5 py-4"
        onSubmit={(e) => {
          e.stopPropagation();
          handleSubmit((data) => {
            setValueParent("externalId", data.externalId, {
              shouldDirty: true,
            });
            setValueParent("tenantId", data.tenantId, {
              shouldDirty: true,
            });
            setShowAdvancedModal(false);
          })(e);
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{t("advanced-options")}</h3>
          <div className="max-md:hidden">
            <Tooltip
              content={
                <div className="px-2 py-1 text-xs text-gray-700">
                  {t("press-a-to-open-quickly", {
                    component0: (
                      <strong className="font-medium text-gray-950">
                        {t("press-a-to-open-quickly_component0")}
                      </strong>
                    ),
                  })}
                </div>
              }
              side="right"
            >
              <kbd className="flex size-6 cursor-default items-center justify-center gap-1 rounded-md border border-gray-200 font-sans text-xs text-gray-950">
                {t("letter-a")}
              </kbd>
            </Tooltip>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {/* External ID */}
          <div>
            <div className="flex items-center gap-2">
              <label
                htmlFor={`${id}-external-id`}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                {t("external-id")}
                <InfoTooltip
                  content={
                    <SimpleTooltipContent
                      title={t("unique-identifier-database")}
                      cta="Learn more about external IDs."
                      href="https://d.to/externalId"
                    />
                  }
                />
              </label>
              <Tooltip
                content={
                  <SimpleTooltipContent
                    title={t("unique-identifier-system")}
                    cta="Learn more about external IDs."
                    href="https://d.to/externalId"
                  />
                }
              />
            </div>
            <div className="mt-2 rounded-md shadow-sm">
              <input
                id={`${id}-external-id`}
                type="text"
                placeholder={t("example-123456")}
                className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                {...register("externalId")}
              />
            </div>
          </div>

          {/* Tenant ID */}
          <div>
            <div className="flex items-center gap-2">
              <label
                htmlFor={`${id}-tenant-id`}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                {t("tenant-id")}
                <InfoTooltip content="The ID of the tenant that created the link inside your system. If set, it can be used to fetch all links for a tenant." />
              </label>
              <Tooltip content="The ID of the tenant that created the link inside your system. If set, it can be used to fetch all links for a tenant." />
            </div>
            <div className="mt-2 rounded-md shadow-sm">
              <input
                id={`${id}-tenant-id`}
                type="text"
                placeholder={t("example-user-123")}
                className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                {...register("tenantId")}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {parentEnabled && (
              <button
                type="button"
                className="text-xs font-medium text-gray-700 transition-colors hover:text-gray-950"
                onClick={() => {
                  setValueParent("externalId", null, { shouldDirty: true });
                  setShowAdvancedModal(false);
                }}
              >
                {t("remove-advanced-options")}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              text={t("cancel")}
              className="h-9 w-fit"
              onClick={() => setShowAdvancedModal(false)}
            />
            <Button
              type="submit"
              variant="primary"
              text={t("save")}
              className="h-9 w-fit"
              disabled={!isDirty}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export function useAdvancedModal() {
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  const AdvancedModalCallback = useCallback(() => {
    return (
      <AdvancedModal
        showAdvancedModal={showAdvancedModal}
        setShowAdvancedModal={setShowAdvancedModal}
      />
    );
  }, [showAdvancedModal, setShowAdvancedModal]);

  return useMemo(
    () => ({
      setShowAdvancedModal,
      AdvancedModal: AdvancedModalCallback,
    }),
    [setShowAdvancedModal, AdvancedModalCallback],
  );
}
