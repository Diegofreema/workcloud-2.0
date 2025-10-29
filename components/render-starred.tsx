import {View, Text, ActivityIndicator} from 'react-native'
import {ActivitiesType} from "~/constants/types";
import {LegendList} from "@legendapp/list";
import {RenderActivity} from "~/components/Ui/render-activity";
import {EmptyText} from "~/components/EmptyText";
import React from "react";
import {Starred} from "~/components/starred";

type Props = {
    onLoadMore: () => void;
    results: ActivitiesType[];
    isLoading: boolean;
};
export const RenderStarred = ({onLoadMore,results,isLoading}: Props) => {
    return (
        <View style={{ flex: 1 }}>
            <LegendList
                data={results}
                recycleItems
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Starred item={item} />
                )}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={() => <EmptyText text="Nothing to see here" />}
                ListFooterComponent={
                    isLoading ? (
                        <ActivityIndicator size="small" style={{ alignSelf: 'center' }} />
                    ) : null
                }
            />
        </View>
    );
};

