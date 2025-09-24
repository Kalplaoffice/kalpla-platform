const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const mediaconvert = new AWS.MediaConvert();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Video upload processor triggered:', JSON.stringify(event, null, 2));
    
    try {
        // Parse S3 event
        const bucket = event.Records[0].s3.bucket.name;
        const key = event.Records[0].s3.object.key;
        const size = event.Records[0].s3.object.size;
        
        console.log(`Processing video: ${key} from bucket: ${bucket}`);
        
        // Validate file type
        if (!key.endsWith('.mp4') && !key.endsWith('.mov') && !key.endsWith('.avi')) {
            console.log('Invalid file type, skipping processing');
            return { statusCode: 200, body: 'Invalid file type' };
        }
        
        // Extract lesson ID from key (assuming format: lessons/{lessonId}/video.mp4)
        const pathParts = key.split('/');
        const lessonId = pathParts[1];
        
        if (!lessonId) {
            throw new Error('Could not extract lesson ID from S3 key');
        }
        
        // Get MediaConvert endpoint
        const endpoints = await mediaconvert.describeEndpoints().promise();
        const endpoint = endpoints.Endpoints[0].Url;
        
        // Create MediaConvert job
        const jobId = uuidv4();
        const outputKey = `processed/${lessonId}/${jobId}/`;
        
        const jobParams = {
            Role: process.env.MEDIACONVERT_ROLE_ARN,
            Settings: {
                Inputs: [{
                    FileInput: `s3://${bucket}/${key}`,
                    AudioSelectors: {
                        "Audio Selector 1": {
                            DefaultSelection: "DEFAULT"
                        }
                    },
                    VideoSelector: {
                        ColorSpace: "FOLLOW"
                    }
                }],
                OutputGroups: [{
                    Name: "HLS",
                    OutputGroupSettings: {
                        Type: "HLS_GROUP_SETTINGS",
                        HlsGroupSettings: {
                            SegmentLength: 6,
                            MinSegmentLength: 0,
                            Destination: `s3://${process.env.VIDEO_BUCKET}/${outputKey}`,
                            ManifestDurationFormat: "INTEGER",
                            ProgramDateTime: "EXCLUDE",
                            TimedMetadataId3Frame: "NONE",
                            TimedMetadataId3Period: 10,
                            Encryption: {
                                EncryptionMethod: "AES_128",
                                KeyProviderSettings: {
                                    StaticKeyProvider: {
                                        KeyFormat: "identity",
                                        KeyFormatVersions: "1",
                                        StaticKeyValue: "0123456789012345"
                                    }
                                }
                            }
                        }
                    },
                    Outputs: [
                        // 4K Quality (if source supports it)
                        {
                            NameModifier: "_2160p",
                            VideoDescription: {
                                Width: 3840,
                                Height: 2160,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        RateControlMode: "QVBR",
                                        QvbrSettings: {
                                            QvbrQualityLevel: 8
                                        },
                                        MaxBitrate: 15000000,
                                        GopSize: 60,
                                        GopSizeUnits: "FRAMES",
                                        FramerateControl: "INITIALIZE_FROM_SOURCE",
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 1
                                    }
                                }
                            },
                            AudioDescriptions: [{
                                AudioSourceName: "Audio Selector 1",
                                CodecSettings: {
                                    Codec: "AAC",
                                    AacSettings: {
                                        Bitrate: 192000,
                                        CodingMode: "CODING_MODE_2_0",
                                        SampleRate: 48000
                                    }
                                }
                            }]
                        },
                        // 1080p Quality
                        {
                            NameModifier: "_1080p",
                            VideoDescription: {
                                Width: 1920,
                                Height: 1080,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        RateControlMode: "QVBR",
                                        QvbrSettings: {
                                            QvbrQualityLevel: 7
                                        },
                                        MaxBitrate: 5000000,
                                        GopSize: 60,
                                        GopSizeUnits: "FRAMES",
                                        FramerateControl: "INITIALIZE_FROM_SOURCE",
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 1
                                    }
                                }
                            },
                            AudioDescriptions: [{
                                AudioSourceName: "Audio Selector 1",
                                CodecSettings: {
                                    Codec: "AAC",
                                    AacSettings: {
                                        Bitrate: 128000,
                                        CodingMode: "CODING_MODE_2_0",
                                        SampleRate: 48000
                                    }
                                }
                            }]
                        },
                        // 720p Quality
                        {
                            NameModifier: "_720p",
                            VideoDescription: {
                                Width: 1280,
                                Height: 720,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        RateControlMode: "QVBR",
                                        QvbrSettings: {
                                            QvbrQualityLevel: 6
                                        },
                                        MaxBitrate: 3000000,
                                        GopSize: 60,
                                        GopSizeUnits: "FRAMES",
                                        FramerateControl: "INITIALIZE_FROM_SOURCE",
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 1
                                    }
                                }
                            },
                            AudioDescriptions: [{
                                AudioSourceName: "Audio Selector 1",
                                CodecSettings: {
                                    Codec: "AAC",
                                    AacSettings: {
                                        Bitrate: 128000,
                                        CodingMode: "CODING_MODE_2_0",
                                        SampleRate: 48000
                                    }
                                }
                            }]
                        },
                        // 480p Quality
                        {
                            NameModifier: "_480p",
                            VideoDescription: {
                                Width: 854,
                                Height: 480,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        RateControlMode: "QVBR",
                                        QvbrSettings: {
                                            QvbrQualityLevel: 5
                                        },
                                        MaxBitrate: 1500000,
                                        GopSize: 60,
                                        GopSizeUnits: "FRAMES",
                                        FramerateControl: "INITIALIZE_FROM_SOURCE",
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 1
                                    }
                                }
                            },
                            AudioDescriptions: [{
                                AudioSourceName: "Audio Selector 1",
                                CodecSettings: {
                                    Codec: "AAC",
                                    AacSettings: {
                                        Bitrate: 96000,
                                        CodingMode: "CODING_MODE_2_0",
                                        SampleRate: 48000
                                    }
                                }
                            }]
                        },
                        // 360p Quality for low bandwidth
                        {
                            NameModifier: "_360p",
                            VideoDescription: {
                                Width: 640,
                                Height: 360,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        RateControlMode: "QVBR",
                                        QvbrSettings: {
                                            QvbrQualityLevel: 4
                                        },
                                        MaxBitrate: 800000,
                                        GopSize: 60,
                                        GopSizeUnits: "FRAMES",
                                        FramerateControl: "INITIALIZE_FROM_SOURCE",
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 1
                                    }
                                }
                            },
                            AudioDescriptions: [{
                                AudioSourceName: "Audio Selector 1",
                                CodecSettings: {
                                    Codec: "AAC",
                                    AacSettings: {
                                        Bitrate: 64000,
                                        CodingMode: "CODING_MODE_2_0",
                                        SampleRate: 48000
                                    }
                                }
                            }]
                        }
                    ]
                }]
            }
        };
        
        // Submit MediaConvert job
        const job = await mediaconvert.createJob(jobParams).promise();
        console.log('MediaConvert job created:', job.Job.Id);
        
        // Update lesson with processing status
        await dynamodb.update({
            TableName: process.env.LESSONS_TABLE,
            Key: { id: lessonId },
            UpdateExpression: 'SET processingStatus = :status, processingJobId = :jobId, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':status': 'PROCESSING',
                ':jobId': job.Job.Id,
                ':updatedAt': new Date().toISOString()
            }
        }).promise();
        
        // Store job metadata
        await dynamodb.put({
            TableName: process.env.VIDEO_JOBS_TABLE,
            Item: {
                id: job.Job.Id,
                lessonId: lessonId,
                inputKey: key,
                outputKey: outputKey,
                status: 'SUBMITTED',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Video processing started',
                jobId: job.Job.Id,
                lessonId: lessonId
            })
        };
        
    } catch (error) {
        console.error('Error processing video:', error);
        
        // Update lesson with error status
        if (lessonId) {
            await dynamodb.update({
                TableName: process.env.LESSONS_TABLE,
                Key: { id: lessonId },
                UpdateExpression: 'SET processingStatus = :status, processingError = :error, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':status': 'ERROR',
                    ':error': error.message,
                    ':updatedAt': new Date().toISOString()
                }
            }).promise();
        }
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process video',
                message: error.message
            })
        };
    }
};
