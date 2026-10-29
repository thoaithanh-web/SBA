// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import api, { errorMessage } from "../api/client";
import { allCategories, createRecord, updateRecord } from "../api/newsApi";
const titles = {
  accounts: "account",
  categories: "category",
  news: "article",
  profile: "profile",
};
export default function RecordDialog({ resource, record, onClose, onSaved }) {
  const editing = Boolean(record);
  const [values, setValues] = useState(() =>
    resource === "accounts"
      ? {
          accountName: record?.accountName || "",
          accountEmail: record?.accountEmail || "",
          accountRole: String(record?.accountRole || 2),
          password: "",
        }
      : resource === "profile"
        ? {
            accountName: record.accountName,
            accountEmail: record.accountEmail,
            password: "",
          }
        : resource === "categories"
          ? {
              categoryName: record?.categoryName || "",
              categoryDescription: record?.categoryDescription || "",
              parentCategoryId: record?.parentCategoryId ?? "",
              active: record?.active ?? true,
            }
          : {
              newsTitle: record?.newsTitle || "",
              headline: record?.headline || "",
              newsContent: record?.newsContent || "",
              newsSource: record?.newsSource || "",
              categoryId: record?.categoryId ?? "",
              newsStatus: record?.newsStatus ?? false,
              tags: record?.tags.map((t) => t.tagName.trim()).join(", ") || "",
            },
  );
  const [categories, setCategories] = useState([]),
    [tags, setTags] = useState([]),
    [loading, setLoading] = useState(["news", "categories"].includes(resource)),
    [loadError, setLoadError] = useState(""),
    [error, setError] = useState(""),
    [fieldErrors, setFieldErrors] = useState({}),
    [pending, setPending] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!["news", "categories"].includes(resource)) return;
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    Promise.all([
      allCategories(controller.signal),
      resource === "news"
        ? api.get("/tags", { signal: controller.signal })
        : Promise.resolve({ data: [] }),
    ])
      .then(([parents, t]) => {
        if (!controller.signal.aborted) {
          setCategories(parents);
          setTags(t.data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setLoadError(errorMessage(e));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [resource, revision]);
  function change(e) {
    const { name, type, checked, value } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  }
  const fields =
    resource === "accounts" || resource === "profile"
      ? [
          { name: "accountName", label: "Full name", required: true, max: 100 },
          {
            name: "accountEmail",
            label: "Email address",
            required: true,
            type: "email",
            max: 70,
          },
          ...(resource === "accounts"
            ? [
                {
                  name: "accountRole",
                  label: "Role",
                  options: [
                    { value: 1, label: "Admin" },
                    { value: 2, label: "Staff" },
                  ],
                },
              ]
            : []),
          {
            name: "password",
            label: "Password",
            type: "password",
            max: 64,
            required: !editing,
            help: editing
              ? "Leave blank to keep the current password. New password: 6–64 characters."
              : "Use 6–64 characters.",
          },
        ]
      : resource === "categories"
        ? [
            {
              name: "categoryName",
              label: "Category name",
              required: true,
              max: 100,
            },
            {
              name: "categoryDescription",
              label: "Description",
              required: true,
              max: 250,
              multiline: true,
            },
            {
              name: "parentCategoryId",
              label: "Parent category",
              options: [
                { value: "", label: "No parent (top level)" },
                ...categories
                  .filter((c) => c.categoryId !== record?.categoryId)
                  .map((c) => ({ value: c.categoryId, label: c.categoryName })),
              ],
            },
            { name: "active", label: "Active category", checkbox: true },
          ]
        : [
            {
              name: "newsTitle",
              label: "Article title",
              required: true,
              max: 400,
            },
            { name: "headline", label: "Headline", required: true, max: 150 },
            {
              name: "categoryId",
              label: "Category",
              required: true,
              options: [
                { value: "", label: "Choose a category" },
                ...categories.map((c) => ({
                  value: c.categoryId,
                  label: c.categoryName + (c.active ? "" : " (inactive)"),
                })),
              ],
            },
            {
              name: "newsContent",
              label: "Article content",
              required: true,
              max: 4000,
              multiline: true,
              rows: 7,
            },
            { name: "newsSource", label: "Source", max: 400 },
            {
              name: "tags",
              label: "Tags",
              max: 650,
              help: "Comma-separated, up to 12 tags. Existing names are reused; new names create tags.",
            },
            { name: "newsStatus", label: "Published", checkbox: true },
          ];
  async function submit(e) {
    e.preventDefault();
    if (pending || loading || loadError) return;
    setError("");
    setFieldErrors({});
    for (const field of fields)
      if (field.required && !String(values[field.name] ?? "").trim()) {
        setError(field.label + " is required.");
        return;
      }
    if (
      (resource === "accounts" || resource === "profile") &&
      values.password &&
      values.password.length < 6
    ) {
      setError("New passwords must contain 6 to 64 characters.");
      return;
    }
    let payload;
    if (resource === "accounts")
      payload = {
        ...values,
        accountName: values.accountName.trim(),
        accountEmail: values.accountEmail.trim(),
        accountRole: Number(values.accountRole),
      };
    else if (resource === "profile")
      payload = {
        ...values,
        accountName: values.accountName.trim(),
        accountEmail: values.accountEmail.trim(),
      };
    else if (resource === "categories")
      payload = {
        ...values,
        parentCategoryId:
          values.parentCategoryId === ""
            ? null
            : Number(values.parentCategoryId),
      };
    else {
      const names = [
        ...new Map(
          values.tags
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
            .map((x) => [x.toLowerCase(), x]),
        ).values(),
      ];
      if (names.length > 12 || names.some((x) => x.length > 50)) {
        setError("Use up to 12 tags with at most 50 characters each.");
        return;
      }
      payload = {
        ...values,
        categoryId: Number(values.categoryId),
        tags: names.map((name) => {
          const tag = tags.find(
            (t) => t.tagName.trim().toLowerCase() === name.toLowerCase(),
          );
          return tag
            ? { tagId: tag.tagId, tagName: tag.tagName, note: tag.note }
            : { tagName: name, note: "" };
        }),
      };
    }
    setPending(true);
    try {
      const response =
        resource === "profile"
          ? await api.put("/profile", payload)
          : editing
            ? await updateRecord(
                resource,
                record.newsArticleId ?? record.accountId ?? record.categoryId,
                payload,
              )
            : await createRecord(resource, payload);
      onSaved(response.data);
    } catch (ex) {
      setError(errorMessage(ex));
      setFieldErrors(ex.response?.data?.fieldErrors || {});
    } finally {
      setPending(false);
    }
  }
  return (
    <Modal
      show
      centered
      size={resource === "news" ? "lg" : undefined}
      onHide={() => {
        if (!pending) onClose();
      }}
      backdrop={pending ? "static" : true}
      keyboard={!pending}
      aria-labelledby="record-dialog-title"
    >
      <Modal.Header closeButton={!pending}>
        <div>
          <p className="eyebrow">YOUR EDITORIAL WORKSPACE</p>
          <Modal.Title id="record-dialog-title">
            {editing ? "Edit" : "Create"} {titles[resource]}
          </Modal.Title>
        </div>
      </Modal.Header>
      <Form onSubmit={submit} noValidate>
        <Modal.Body>
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}
          {loading ? (
            <p role="status">Loading form options…</p>
          ) : loadError ? (
            <div>
              <Alert variant="danger" role="alert">
                {loadError}
              </Alert>
              <Button
                variant="outline-secondary"
                onClick={() => setRevision((v) => v + 1)}
              >
                Retry options
              </Button>
            </div>
          ) : (
            <fieldset disabled={pending}>
              <div className={resource === "news" ? "news-form-grid" : ""}>
                {fields.map((field, index) => (
                  <Form.Group
                    key={field.name}
                    controlId={"field-" + field.name}
                    className={"mb-3 " + (field.multiline ? "full-width" : "")}
                  >
                    {field.checkbox ? (
                      <Form.Check
                        type="switch"
                        name={field.name}
                        label={field.label}
                        checked={values[field.name]}
                        onChange={change}
                      />
                    ) : (
                      <>
                        <Form.Label>
                          {field.label}
                          {field.required && (
                            <span aria-hidden="true" className="required">
                              {" "}
                              *
                            </span>
                          )}
                        </Form.Label>
                        {field.options ? (
                          <Form.Select
                            autoFocus={index === 0}
                            name={field.name}
                            value={values[field.name]}
                            onChange={change}
                            isInvalid={!!fieldErrors[field.name]}
                          >
                            {field.options.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </Form.Select>
                        ) : (
                          <Form.Control
                            autoFocus={index === 0}
                            name={field.name}
                            value={values[field.name]}
                            onChange={change}
                            as={field.multiline ? "textarea" : "input"}
                            rows={field.multiline ? field.rows || 3 : undefined}
                            type={field.type || "text"}
                            maxLength={field.max}
                            autoComplete={
                              field.type === "password" ? "new-password" : "off"
                            }
                            isInvalid={!!fieldErrors[field.name]}
                          />
                        )}
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors[field.name]}
                        </Form.Control.Feedback>
                      </>
                    )}
                    {field.help && <Form.Text>{field.help}</Form.Text>}
                  </Form.Group>
                ))}
              </div>
            </fieldset>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" disabled={pending} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending || loading || !!loadError}>
            {pending
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create " + titles[resource]}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
