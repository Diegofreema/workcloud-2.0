## Goal
Rebuild `components/plans.tsx` to match the provided subscription mock exactly, while keeping navigation to the existing checkout flow in `components/subcritions.tsx` unchanged.

## Key Changes
1. Header
- Add an inline header at the top: back arrow (`router.back()`) + title `Subscribe Workspace`.

2. Billing Toggle
- Add a segmented control for `Billed Annually` and `Billed Monthly`.
- Use local state `billingInterval: 'month' | 'year'` (default `'month'`).
- Show helper text below: `Get 20% Discount by Subscribing Annual Plan`.

3. Product Cards
- Replace the current minimalist card with the mock-styled cards:
  - Top: plan name (e.g., `Cloud Basic`).
  - Price line: formatted amount + currency + `Monthly`/`Annually` label based on the selected interval.
  - Description: use `product.description` (keeps copy from Polar product; later we can adjust if you want the exact "Access to X Workspaces" text source).
  - CTA button: `Activate` (solid or light depending on selection). Pressing navigates to `router.push('/single-sub?id=${product.id}')`.
  - Visuals: rounded container, thin border; apply a blue highlight style to the “currently selected” card when tapped (optional since we navigate immediately).

4. Price Selection & Formatting
- Determine price from `product.prices` that matches `billingInterval`.
- Fallbacks: if no match, use `product.priceAmount` & `product.recurringInterval` when present.
- Format currency with `Intl.NumberFormat(priceCurrency.toUpperCase(), { style: 'currency', currency: priceCurrency.toUpperCase() })`.
- Treat amounts as minor units when values appear large (divide by 100); if Polar returns major units, the output will still look correct (we’ll code defensively to handle both).

5. List Layout
- Keep `FlatList` and the existing `arrangedProducts` order.
- Replace `ListHeaderComponent` with the new header + toggle + helper text.
- Preserve dark-mode awareness via `useColorScheme` and `Colors`.

## Implementation Outline
- Update `Plans` component:
  - Add `billingInterval` state and render the segmented toggle in the list header.
  - Pass `billingInterval` to each card.
- Refactor `OfferingCard` props to accept `billingInterval` and render:
  - Plan name
  - Price (selected interval)
  - Description
  - `Activate` button → push to `/single-sub?id=${product.id}`.
- Create small helpers inside the file:
  - `getPrice(product, interval)` to pick the right price object.
  - `formatAmount(amount, currency)` to format for display.

## Verification
- Manual run to verify:
  - Toggle correctly switches Monthly/Annually amounts and labels.
  - Cards match the mock styling and spacing.
  - Pressing `Activate` navigates to the existing single subscription screen.
  - Dark/light color harmony.

If this plan looks good, I’ll implement the UI update in `components/plans.tsx` without changing any subscription logic.