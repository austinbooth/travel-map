import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setPlaceInFirestore } from './firestoreUtils'
import { MediaData } from './types'

// If there are more mutations, then this hook could be altered to accept some id of the type of mutation wanted,
// and then return the corresponding useMutation fn call

export const usePopupPlaceMutation = ({uid, userUid, infoUid}: {uid: string, userUid: string, infoUid: string}) => {
  const queryClient = useQueryClient()
  return useMutation((newLocation: string) => setPlaceInFirestore(userUid, infoUid, newLocation), {
    onMutate: async (newLocation: string) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['getMedia'])

        // Snapshot the previous value
        const previous = (queryClient.getQueryData(['getMedia']) as MediaData[]).find((location) => location.uid === uid)
        if (previous === undefined) {
        throw new Error('Could not find old values')
        }
        // Optimistically update to the new value
        queryClient.setQueryData(['getMedia'], () => {
        return [{...previous, place: newLocation}]
        })
        // Return a context object with the snapshotted value
        return { previous }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newLocation, context) => {
        if (context === undefined) {
        throw new Error('Context not set')
        }
        queryClient.setQueryData(['getMedia'], context.previous)
    },
    // Always refetch after error or success:
    onSettled: () => {
        queryClient.invalidateQueries(['getMedia'])
    },
  })
}