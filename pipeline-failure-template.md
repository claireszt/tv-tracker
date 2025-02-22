## 🚨 Pipeline Failure Detected!

The **${{ github.workflow }}** workflow has failed on **`${{ github.ref_name }}`**.

### 🔍 **Details:**

- **🔀 Branch:** `${{ github.ref_name }}`
- **🆔 Commit:** [`${{ github.sha }}`](https://github.com/${{ github.repository }}/commit/${{ github.sha }})
- [🔗 Workflow Run](${{ github.run_url }})

### ✅ **Checklist for Resolution:**

- [ ] Root cause identified.
- [ ] Fix implemented and committed.
- [ ] CI/CD pipeline verified successfully.
- [ ] Merge PR into `dev`, `staging`, or `prod`.
