import type { Attachment } from "./entity";

export const getFile = async (data: Attachment) => {
fetch(`${import.meta.env.VITE_API_URL}/api/uploads/file?id=` + data.id, {
    method: 'GET',
    credentials: "include"
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${data.name}.${data.extension}`,
    );

    document.body.appendChild(link);

    link.click();

    link.parentNode?.removeChild(link);
  });
};
