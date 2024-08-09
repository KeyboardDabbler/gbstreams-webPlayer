import type { BaseItemDto, BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import type { ApiClient } from 'jellyfin-apiclient';
import classNames from 'classnames';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { CollectionType } from '@jellyfin/sdk/lib/generated-client/models/collection-type';
import { useDebounceValue } from 'usehooks-ts';

import globalize from '../../scripts/globalize';
import Loading from '../loading/LoadingComponent';
import SearchResultsRow from './SearchResultsRow';
import { CardShape } from 'utils/card';

interface SearchResultsProps {
    parentId?: string;
    collectionType?: string;
    query?: string;
}

/*
 * React component to display search result rows for global search and library view search
 */
const SearchResults: FC<SearchResultsProps> = ({
    parentId,
    collectionType,
    query
}) => {
    const { isLoading, data } = useSearchItems(parentId, collectionType, query);

    if (isLoading) return <Loading />;

    if (!data?.length) {
        return (
            <div className='noItemsMessage centerMessage'>
                {globalize.translate('SearchResultsEmpty', query)}
            </div>
        );
    }

    const fetchItems = useCallback(async (apiClient?: ApiClient, params = {}) => {
        if (!apiClient) {
            console.error('[SearchResults] no apiClient; unable to fetch items');
            return {
                Items: []
            };
        }

        const options = {
            ...getDefaultParameters(),
            IncludeMedia: true,
            ...params
        };

        if (params.IncludeItemTypes === BaseItemKind.Episode) {
            const user = await apiClient.getCurrentUser();
            if (!user?.Configuration?.DisplayMissingEpisodes) {
                options.IsMissing = false;
            }
        }

        return apiClient.getItems(
            apiClient.getCurrentUserId(),
            options
        ).then(ensureNonNullItems);
    }, [getDefaultParameters]);

    const fetchPeople = useCallback((apiClient: ApiClient, params = {}) => (
        apiClient?.getPeople(
            apiClient.getCurrentUserId(),
            {
                ...getDefaultParameters(),
                IncludePeople: true,
                ...params
            }
        ).then(ensureNonNullItems)
    ), [getDefaultParameters]);

    useEffect(() => {
        if (query) setIsLoading(true);
    }, [ query ]);

    useEffect(() => {
        // Reset state
        setMovies([]);
        setShows([]);
        setEpisodes([]);
        setVideos([]);
        setPrograms([]);
        setChannels([]);
        setPlaylists([]);
        setArtists([]);
        setAlbums([]);
        setSongs([]);
        setPhotoAlbums([]);
        setPhotos([]);
        setAudioBooks([]);
        setBooks([]);
        setPeople([]);
        setCollections([]);

        if (!debouncedQuery) {
            setIsLoading(false);
            return;
        }

        const apiClient = ServerConnections.getApiClient(serverId);
        const fetchPromises = [];

        // Movie libraries
        if (!collectionType || isMovies(collectionType)) {
            fetchPromises.push(
                // Movies row
                fetchItems(apiClient, { IncludeItemTypes: 'Movie' })
                    .then(result => setMovies(result.Items))
                    .catch(() => setMovies([]))
            );
        }

        // TV Show libraries
        if (!collectionType || isTVShows(collectionType)) {
            fetchPromises.push(
                // Shows row
                fetchItems(apiClient, { IncludeItemTypes: 'Series' })
                    .then(result => setShows(result.Items))
                    .catch(() => setShows([])),
                // Episodes row
                fetchItems(apiClient, { IncludeItemTypes: 'Episode' })
                    .then(result => setEpisodes(result.Items))
                    .catch(() => setEpisodes([]))
            );
        }

        // People are included for Movies and TV Shows
        if (!collectionType || isMovies(collectionType) || isTVShows(collectionType)) {
            fetchPromises.push(
                // People row
                fetchPeople(apiClient)
                    .then(result => setPeople(result.Items))
                    .catch(() => setPeople([]))
            );
        }

        // Music libraries
        if (!collectionType || isMusic(collectionType)) {
            fetchPromises.push(
                // Playlists row
                fetchItems(apiClient, { IncludeItemTypes: 'Playlist' })
                    .then(results => setPlaylists(results.Items))
                    .catch(() => setPlaylists([])),
                // Artists row
                fetchArtists(apiClient)
                    .then(result => setArtists(result.Items))
                    .catch(() => setArtists([])),
                // Albums row
                fetchItems(apiClient, { IncludeItemTypes: 'MusicAlbum' })
                    .then(result => setAlbums(result.Items))
                    .catch(() => setAlbums([])),
                // Songs row
                fetchItems(apiClient, { IncludeItemTypes: 'Audio' })
                    .then(result => setSongs(result.Items))
                    .catch(() => setSongs([]))
            );
        }

        // Other libraries do not support in-library search currently
        if (!collectionType) {
            fetchPromises.push(
                // Videos row
                fetchItems(apiClient, {
                    MediaTypes: 'Video',
                    ExcludeItemTypes: 'Movie,Episode,TvChannel'
                })
                    .then(result => setVideos(result.Items))
                    .catch(() => setVideos([])),
                // Programs row
                fetchItems(apiClient, { IncludeItemTypes: 'LiveTvProgram' })
                    .then(result => setPrograms(result.Items))
                    .catch(() => setPrograms([])),
                // Channels row
                fetchItems(apiClient, { IncludeItemTypes: 'TvChannel' })
                    .then(result => setChannels(result.Items))
                    .catch(() => setChannels([])),
                // Photo Albums row
                fetchItems(apiClient, { IncludeItemTypes: 'PhotoAlbum' })
                    .then(result => setPhotoAlbums(result.Items))
                    .catch(() => setPhotoAlbums([])),
                // Photos row
                fetchItems(apiClient, { IncludeItemTypes: 'Photo' })
                    .then(result => setPhotos(result.Items))
                    .catch(() => setPhotos([])),
                // Audio Books row
                fetchItems(apiClient, { IncludeItemTypes: 'AudioBook' })
                    .then(result => setAudioBooks(result.Items))
                    .catch(() => setAudioBooks([])),
                // Books row
                fetchItems(apiClient, { IncludeItemTypes: 'Book' })
                    .then(result => setBooks(result.Items))
                    .catch(() => setBooks([])),
                // Collections row
                fetchItems(apiClient, { IncludeItemTypes: 'BoxSet' })
                    .then(result => setCollections(result.Items))
                    .catch(() => setCollections([]))
            );
        }
        Promise.all(fetchPromises)
            .then(() => {
                setIsLoading(false); // Set loading to false when all fetch calls are done
            })
            .catch((error) => {
                console.error('An error occurred while fetching data:', error);
                setIsLoading(false); // Set loading to false even if an error occurs
            });
    }, [collectionType, fetchArtists, fetchItems, fetchPeople, debouncedQuery, serverId]);

    const allEmpty = [movies, shows, episodes, videos, programs, channels, playlists, artists, albums, songs, photoAlbums, photos, audioBooks, books, people, collections].every(arr => arr.length === 0);

    return (
        <div className={'searchResults, padded-top, padded-bottom-page'}>
            {data.map((section, index) => renderSection(section, index))}
        </div>
    );
};

export default SearchResults;
