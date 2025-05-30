import { useQuery } from "@tanstack/react-query"

import { apiClient } from "~/lib/api-fetch"
import { getProviders } from "~/lib/auth"
import { defineQuery } from "~/lib/defineQuery"
import { isInMAS } from "~/lib/utils"

export const users = {
  profile: ({ userId }: { userId: string }) =>
    defineQuery(["profiles", userId], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: userId! },
      })
      return res.data
    }),
}

export interface AuthProvider {
  name: string
  id: string
  color: string
  icon: string
}
export const useAuthProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () =>
      (
        await getProviders(undefined, {
          headers: isInMAS() ? { "X-MAS": "1" } : undefined,
        })
      ).data as Record<string, AuthProvider>,
  })
}
