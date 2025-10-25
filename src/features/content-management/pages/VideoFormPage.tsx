// src/features/content-management/pages/FormVideoPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoForm } from "@/features/content-management/components/VideoForm/VideoForm";
import {
    Video,
    VideoRequest,
    useGetVideoBySlugQuery,
    useUpdateVideoMutation,
    useCreateVideoMutation,
} from "@/features/content-management/api/videosApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";
import { Skeleton } from '@/common/components/ui/skeleton';

const FormVideoPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isEditMode = !!slug;

    const { data: video, isLoading: isVideoLoading } = useGetVideoBySlugQuery(slug, {
        skip: !isEditMode,
    });

    const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();
    const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation();

    const isLoading = isVideoLoading || isUpdating || isCreating;

    const handleSubmit = async (videoData: VideoRequest) => {
        try {
            if (isEditMode) {
                if (slug) {
                    await updateVideo({ slug, body: videoData }).unwrap();
                    toast({
                        title: "Video Actualizado",
                        description: `El video "${videoData.title}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createVideo(videoData).unwrap();
                toast({
                    title: "Video Creado",
                    description: `El video "${videoData.title}" ha sido creado exitosamente.`,
                });
            }
            navigate("/content-management/videos");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${ isEditMode ? "actualizar" : "crear" } el video.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/content-management/videos");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Video" : "Añadir Nuevo Video"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isEditMode && isVideoLoading ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <Skeleton className="aspect-[3/4] rounded-lg" />
                            </div>
                            <div className="lg:col-span-2 space-y-6">
                                <Skeleton className="h-[200px] w-full" />
                                <Skeleton className="h-[150px] w-full" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 pt-6">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                ) : (
                    <VideoForm
                        initialData={isEditMode ? video : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isLoading}
                    />
                )}
            </div>
        </Card>
    );
};

export default FormVideoPage;
