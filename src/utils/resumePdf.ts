import { asset } from './asset'

export const resumePdfUrl = asset("resume.pdf");

export function downloadResumePdf() {
  const link = document.createElement("a");
  link.href = resumePdfUrl;
  link.download = "Kevin Lam Resume.pdf";
  link.click();
}

export function openResumePdf() {
  window.open(resumePdfUrl, "_blank", "noopener");
}
