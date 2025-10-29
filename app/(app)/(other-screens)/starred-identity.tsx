import {Container} from "~/components/Ui/Container";
import {HeaderNav} from "~/components/HeaderNav";
import {useGetUserId} from "~/hooks/useGetUserId";
import {usePaginatedQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {RenderStarred} from "~/components/render-starred";



const StarredIdentity = () => {
    const {workspaceId} = useGetUserId();
    const { isLoading, loadMore, results, status } = usePaginatedQuery(
        api.worker.getStarred,
       workspaceId ?  { id: workspaceId } : 'skip',
        { initialNumItems: 50 }
    );
    const onLoadMore = () => {
        if (status === 'CanLoadMore' && !isLoading) {
            loadMore(50);
        }
    };
    return (
        <Container>
            <HeaderNav title={'Starred Identity'} />
            <RenderStarred
                onLoadMore={onLoadMore}
                results={results}
                isLoading={isLoading}
            />
        </Container>
    );
};
export default StarredIdentity;

