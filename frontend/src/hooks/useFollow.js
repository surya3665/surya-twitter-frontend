import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const querryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/user/follow/${userId}`, {
          method: "POST",
        });

        const data = res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    onSuccess: () => {
        Promise.all([
            querryClient.invalidateQueries({queryKey:["suggestedUser"]}),
            querryClient.invalidateQueries({queryKey: ["authUser"]})
        ])
      
    },
    onError: (error) => {
        toast.error(error.message)
    }
  });
  return {mutate, isPending}
};

export default useFollow;
