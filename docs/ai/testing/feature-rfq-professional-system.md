---
phase: testing
feature: rfq-professional-system
---
# Testing — Professional B2B RFQ System

> Testing plan will be populated during implementation. See design doc for verification plan.

## Unit Tests
- [ ] XLSX generator: correct file structure
- [ ] Email template: correct HTML output
- [ ] Deletion constraints: category/brand guard trigger
- [ ] Quote validation: required fields check

## Integration Tests
- [ ] POST /api/quotes → D1 save + XLSX + emails
- [ ] Admin CRUD operations
- [ ] Cart flow end-to-end

## Browser Tests
- [ ] Cart add/remove/update flow
- [ ] Quote submission form
- [ ] Admin quotation management
